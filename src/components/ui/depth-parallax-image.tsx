"use client";
import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/utils/cn";

/*
 * Two-layer depth parallax ("holding the selfie").
 *
 * The photo is split into two layers that are rendered separately and composited per pixel:
 *   1. Subject: the original photo cut out by a soft alpha matte, with its own smooth depth map.
 *   2. Background: an inpainted plate (the photo with the subject removed) with its own depth map.
 * A single depth map cannot do this cleanly: its silhouette never lines up exactly with the photo, and
 * even a perfect one smears subject edge pixels into whatever background the motion uncovers. With
 * two layers the subject keeps its exact outline, and uncovered background comes from the plate.
 *
 * Pointer convention used everywhere below: x in [-1, 1] with +1 at the RIGHT edge, y in [-1, 1] with
 * +1 at the TOP edge (flipped from clientY). The pointer is where the viewer's eye moves: the eye
 * orbits a pivot plane at depth `focus` (the subject), so pivot-depth content stays put, content
 * behind it follows the eye, and content in front of it moves the opposite way.
 */

/**
 * Tilt direction, the only sign to flip if the card should feel "pushed" instead of "orbited".
 *
 * CSS 3D axes: +x right, +y DOWN, +z toward the viewer.
 *   rotateY(+a): z' = -x*sin(a) + z*cos(a), so the right edge (x > 0) gets z' < 0 and RECEDES.
 *   rotateX(+a): z' =  y*sin(a) + z*cos(a), so the top edge (y < 0) gets z' < 0 and RECEDES.
 * The eye orbiting right/up equals the card turning the opposite way under a fixed eye, which brings
 * the right/top edge NEARER. So: rotateY(TILT_DIRECTION * k * x), rotateX(TILT_DIRECTION * k * yUp).
 */
const TILT_DIRECTION = -1;

/** Pointer units. About 0.02px of parallax and 0.01deg of tilt, so snapping to the target is invisible. */
const SETTLE_EPSILON = 1e-3;
/** Seconds. Caps a single step after a stalled frame or a background tab so nothing jumps. */
const MAX_FRAME_DT = 1 / 20;
/** Seconds per axis of the touch auto-orbit. Incommensurate periods keep the Lissajous path drifting. */
const ORBIT_PERIOD_X = 9;
const ORBIT_PERIOD_Y = 13;
/** Extra image-UV headroom at full reach so the filter footprint never touches the clamped border. */
const EDGE_MARGIN = 0.0015;
/** Milliseconds. Canvas cross-fade over the static image once WebGL has rendered its first frame. */
const FADE_MS = 450;
/** Largest relative aspect-ratio difference tolerated between the color, plate and layers images. */
const ASPECT_TOLERANCE = 0.01;

const NO_HOVER_QUERY = "(hover: none), (pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/*
 * Color management: one rule, no conversions anywhere.
 * All three textures are NoColorSpace, so three uploads the raw file bytes (RGBA8, not SRGB8_ALPHA8,
 * and UNPACK_COLORSPACE_CONVERSION = NONE). A ShaderMaterial never runs colorspace_fragment, so the
 * sRGB-encoded values of the color and plate textures reach the sRGB canvas untouched (`flat` and
 * `linear` on the Canvas also switch off the renderer's own tone mapping and output transfer). The
 * result equals what <img> shows, and filtering, mipmaps and the layer blend happen in gamma space, as
 * the browser's own image downscaler does.
 * Consequence: `src` and `plateSrc` must be sRGB. NONE ignores embedded ICC profiles, so an iPhone
 * Display P3 JPEG would look washed out (headshot-parallax.jpg was converted to sRGB for exactly this
 * reason). The layers image is data, and NONE also keeps any gAMA/ICC chunk in it from remapping values.
 */

const vertexShader = /* glsl */ `
out vec2 vUv;

void main() {
  vUv = uv;
  // Fullscreen quad: the 2x2 plane's positions already are clip-space coordinates.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
// three prepends "precision highp float/int/sampler2D" whenever the GPU supports highp.
uniform sampler2D uColor;   // the photo (sRGB values): subject layer color
uniform sampler2D uPlate;   // the photo with the subject inpainted away (sRGB values): background color
uniform sampler2D uLayers;  // data: r = background depth, g = subject matte, b = subject depth
uniform vec2 uPointer;      // smoothed pointer in [-1, 1], +y = up
uniform vec2 uUvScale;      // visible image-UV extent: cover fit divided by overscan zoom
uniform float uStrength;    // UV shift per unit of depth away from the focus plane at full pointer
uniform float uFocus;       // pivot plane depth, 1 = near, 0 = far
uniform float uImageAspect; // image width / height

in vec2 vUv;
out vec4 fragColor;

const int SUBJECT_SOLVE_STEPS = 3;
const int MARCH_STEPS = 32;
const int REFINE_STEPS = 5;
// LOD bias through gradient scaling. Below 1 sharpens the color and matte lookups toward the browser's
// <img> downscale; above 1 reads softer depth mips so silhouettes interpolate instead of stair-stepping.
const float COLOR_GRAD_SCALE = 0.8;
const float DEPTH_GRAD_SCALE = 2.0;
// Image-UV shift length over which the output blends from the untouched photo to the composite.
const float REST_BLEND_RANGE = 0.0015;

void main() {
  // Screen UV to image UV (both have their origin bottom-left, +y up; see flipY in prepareTexture).
  vec2 base = 0.5 + (vUv - 0.5) * uUvScale;

  // Gradients come from the smooth base UV, taken once outside all loops and branches. Implicit
  // derivatives inside the data-dependent solve and march are undefined, and the sample UVs jump at
  // depth edges, which would pick a blurry mip along every silhouette.
  vec2 gx = dFdx(base);
  vec2 gy = dFdy(base);
  vec2 colorGx = gx * COLOR_GRAD_SCALE;
  vec2 colorGy = gy * COLOR_GRAD_SCALE;
  vec2 depthGx = gx * DEPTH_GRAD_SCALE;
  vec2 depthGy = gy * DEPTH_GRAD_SCALE;

  // The photo exactly as the static <img> shows it.
  vec3 still = textureGrad(uColor, base, colorGx, colorGy).rgb;

  // The v shift is scaled by the image aspect so a shift covers the same pixel distance on both axes.
  vec2 view = uPointer * uStrength * vec2(1.0, uImageAspect);

  vec3 color = still;
  if (dot(view, view) > 1e-12) {
    // Sign convention, shared by both layers. A feature at image UV f with depth t is drawn at screen
    // position q where q + view * (t - focus) = f, so q = f + view * (focus - t). With the eye moved
    // right (view.x > 0): far content (t < focus) lands at q.x > f.x and shifts right with the eye,
    // near content (t > focus) shifts left, and t == focus stays put. The same holds for y, +y = up.

    // Layer 1, subject: solve f = base + view * (depthB(f) - focus) by fixed-point iteration. The
    // subject depth is smooth and extended past the matte, and |view| is a few hundredths, so the map
    // is a strong contraction and a few steps land well under a texel. The matte then cuts the
    // subject out at that position, so its outline travels with it instead of smearing.
    vec2 uvF = base;
    for (int i = 0; i < SUBJECT_SOLVE_STEPS; i++) {
      float tS = textureGrad(uLayers, uvF, depthGx, depthGy).b;
      uvF = base + view * (tS - uFocus);
    }
    // Matte and color share one footprint, so the anti-aliased edge lines up with the photo's own.
    float alpha = textureGrad(uLayers, uvF, colorGx, colorGy).g;
    vec3 fg = textureGrad(uColor, uvF, colorGx, colorGy).rgb;

    vec3 composite = fg;
    // Fully opaque subject pixels hide the background entirely: skip its march (same result).
    if (alpha < 1.0) {
      // Layer 2, background: ray-march the background depth (r) and color from the inpainted plate,
      // so the band the subject uncovers shows real background instead of stretched subject pixels.
      float tHit = uFocus;
      float layer = 1.0 / float(MARCH_STEPS);
      float tPrev = 1.0;
      float dPrev = textureGrad(uLayers, base + view * (tPrev - uFocus), depthGx, depthGy).r;
      if (dPrev >= tPrev) {
        tHit = 1.0;
      } else {
        // March from near (t = 1) to far (t = 0). The first layer whose sampled depth reaches the ray
        // is the frontmost surface along it. At t = 0 every depth satisfies d >= t, so a hit is
        // guaranteed and "no hit" resolves to the far plane.
        for (int i = 1; i <= MARCH_STEPS; i++) {
          float t = 1.0 - float(i) * layer;
          float d = textureGrad(uLayers, base + view * (t - uFocus), depthGx, depthGy).r;
          if (d >= t) {
            // Bracket: hi misses (depth < t), lo hits (depth >= t). Bisect, then take the secant root
            // of f(t) = depth(t) - t inside the final bracket for a sub-layer, band-free hit.
            float hi = tPrev;
            float dHi = dPrev;
            float lo = t;
            float dLo = d;
            for (int j = 0; j < REFINE_STEPS; j++) {
              float mid = 0.5 * (hi + lo);
              float dMid = textureGrad(uLayers, base + view * (mid - uFocus), depthGx, depthGy).r;
              if (dMid >= mid) {
                lo = mid;
                dLo = dMid;
              } else {
                hi = mid;
                dHi = dMid;
              }
            }
            float missGap = hi - dHi;
            float hitGap = dLo - lo;
            tHit = mix(hi, lo, missGap / max(missGap + hitGap, 1e-6));
            break;
          }
          tPrev = t;
          dPrev = d;
        }
      }
      vec3 bg = textureGrad(uPlate, base + view * (tHit - uFocus), colorGx, colorGy).rgb;
      composite = mix(bg, fg, alpha);
    }

    // Rest-pose exactness. At view == 0 the composite is not quite the photo (soft matte edges over
    // the inpainted plate), so ease from the photo into the composite over the first few hundredths
    // of a pixel of shift. Continuous in the pointer, so motion starts and ends without a pop.
    color = mix(still, composite, clamp(length(view) / REST_BLEND_RANGE, 0.0, 1.0));
  }

  fragColor = vec4(color, 1.0);
}
`;

type ParallaxSettings = {
  strength: number;
  focus: number;
  maxTiltDeg: number;
  smoothing: number;
  orbitAmplitude: number;
};

type LoadedTextures = {
  color: THREE.Texture;
  plate: THREE.Texture;
  layers: THREE.Texture;
  imageAspect: number;
};

type GLStatus = "pending" | "ready" | "failed";

type MotionState = {
  // Targets: pointer x, pointer y (+up), and the hover envelope that drives overscan.
  tx: number;
  ty: number;
  te: number;
  // Smoothed values.
  x: number;
  y: number;
  e: number;
  orbiting: boolean;
  orbitTime: number;
  animating: boolean;
  last: number;
};

type MotionEngine = ReturnType<typeof createMotionEngine>;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Pointer smoothing and CSS tilt, independent of React renders and of WebGL.
 * While a WebGL scene is live it drives the steps from useFrame (frameloop="demand", invalidating
 * only while animating). Otherwise, before textures load or after a failure, it uses its own rAF
 * loop so the tilt still works. Only one driver runs at a time.
 */
function createMotionEngine(
  cardRef: React.RefObject<HTMLDivElement | null>,
  settingsRef: React.MutableRefObject<ParallaxSettings>
) {
  const state: MotionState = {
    tx: 0,
    ty: 0,
    te: 0,
    x: 0,
    y: 0,
    e: 0,
    orbiting: false,
    orbitTime: 0,
    animating: false,
    last: 0,
  };
  let raf = 0;
  let invalidate: (() => void) | null = null;

  const writeTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    const k = TILT_DIRECTION * settingsRef.current.maxTiltDeg;
    card.style.transform = `rotateX(${(k * state.y).toFixed(3)}deg) rotateY(${(
      k * state.x
    ).toFixed(3)}deg)`;
  };

  /** Advances one frame. Returns true while another frame is needed. */
  const step = (now: number) => {
    const s = settingsRef.current;
    const dt =
      state.last > 0 ? clamp((now - state.last) / 1000, 0, MAX_FRAME_DT) : 1 / 60;
    state.last = now;

    if (state.orbiting) {
      state.orbitTime += dt;
      const t = state.orbitTime * 2 * Math.PI;
      state.tx = s.orbitAmplitude * Math.sin(t / ORBIT_PERIOD_X);
      state.ty = s.orbitAmplitude * Math.sin(t / ORBIT_PERIOD_Y);
      state.te = s.orbitAmplitude;
    }

    // Frame-rate independent exponential damping: critically damped feel, never overshoots.
    const a = 1 - Math.exp(-dt * s.smoothing);
    state.x += (state.tx - state.x) * a;
    state.y += (state.ty - state.y) * a;
    state.e += (state.te - state.e) * a;

    const settled =
      !state.orbiting &&
      Math.abs(state.tx - state.x) < SETTLE_EPSILON &&
      Math.abs(state.ty - state.y) < SETTLE_EPSILON &&
      Math.abs(state.te - state.e) < SETTLE_EPSILON;
    if (settled) {
      state.x = state.tx;
      state.y = state.ty;
      state.e = state.te;
      state.animating = false;
      state.last = 0;
    }
    writeTilt();
    return !settled;
  };

  const tick = () => {
    raf = 0;
    // The card ref is detached on unmount. Cleanups that run later may still kick, so the loop ends here.
    if (!cardRef.current) return;
    if (invalidate) {
      // A WebGL scene came up mid-animation: hand the loop over to it.
      invalidate();
      return;
    }
    if (step(performance.now())) raf = requestAnimationFrame(tick);
  };

  const stopRaf = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  return {
    state,
    step,
    kick() {
      if (!state.animating) {
        state.animating = true;
        state.last = 0;
      }
      if (invalidate) invalidate();
      else if (!raf) raf = requestAnimationFrame(tick);
    },
    setInvalidate(fn: (() => void) | null) {
      invalidate = fn;
      if (fn) {
        stopRaf();
        if (state.animating) fn();
      } else if (state.animating && !raf) {
        raf = requestAnimationFrame(tick);
      }
    },
    /** Snaps to rest and removes the transform entirely (reduced motion). */
    reset() {
      stopRaf();
      Object.assign(state, {
        tx: 0,
        ty: 0,
        te: 0,
        x: 0,
        y: 0,
        e: 0,
        orbiting: false,
        animating: false,
        last: 0,
      });
      if (cardRef.current) cardRef.current.style.transform = "";
      invalidate?.();
    },
    dispose() {
      stopRaf();
      invalidate = null;
    },
  };
}

/**
 * object-fit: cover plus the minimum overscan that keeps every parallax sample inside the texture.
 *
 * Cover: the visible fraction of the image per axis is
 *   cover = (min(1, canvasAspect / imageAspect), min(1, imageAspect / canvasAspect)).
 * Parallax: every lookup of either layer (the subject solve and the background march alike) samples
 * base + view * (t - focus) for some depth t in [0, 1], with
 *   |view| <= strength * (1, imageAspect) * |pointer|,
 * and |t - focus| <= max(focus, 1 - focus) over t in [0, 1]. So the largest offset per axis is
 *   m = reach * (strength * max(focus, 1 - focus) * (1, imageAspect) + EDGE_MARGIN).
 * All samples stay in [0, 1] iff 0.5 + cover / (2 * zoom) + m <= 1, i.e. zoom >= cover / (1 - 2m).
 * Zoom is uniform and never below 1: zoom = max(1, coverX / (1 - 2mX), coverY / (1 - 2mY)).
 * The axis the cover fit crops already has (1 - cover) / 2 of slack, so often only one axis needs it.
 *
 * reach = max(hover envelope, |pointer|) per axis. The envelope eases in on enter and out on leave,
 * so the zoom holds steady while the pointer crosses the center instead of breathing with it, and
 * at rest reach = 0 gives zoom = 1: the canvas matches the static image pixel for pixel.
 * ParallaxScene scales pointer and reach by its reveal gain, which stays 0 until the fade-in is over,
 * so the canvas also cross-fades in at that pixel-exact rest pose while the pointer is engaged.
 */
function computeUvScale(
  out: THREE.Vector2,
  canvasAspect: number,
  imageAspect: number,
  settings: ParallaxSettings,
  reachX: number,
  reachY: number
) {
  const coverX = Math.min(1, canvasAspect / imageAspect);
  const coverY = Math.min(1, imageAspect / canvasAspect);
  const lever = settings.strength * Math.max(settings.focus, 1 - settings.focus);
  const mX = Math.min(0.45, reachX * (lever + EDGE_MARGIN));
  const mY = Math.min(0.45, reachY * (lever * imageAspect + EDGE_MARGIN));
  const zoom = Math.max(1, coverX / (1 - 2 * mX), coverY / (1 - 2 * mY));
  return out.set(coverX / zoom, coverY / zoom);
}

function prepareTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  // All are minified 2-3x on screen and read with textureGrad, so all get trilinear mipmaps.
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  // Image textures default to flipY = true. Keep it on all of them so UV (0, 0) is the bottom-left of
  // each image, matching the quad's uv attribute and the +y = up pointer.
  texture.flipY = true;
  texture.needsUpdate = true;
}

/** Natural width / height of a loaded image texture, or 0 when unknown. */
function imageAspectOf(texture: THREE.Texture<HTMLImageElement>) {
  const image = texture.image;
  return image && image.naturalWidth > 0 && image.naturalHeight > 0
    ? image.naturalWidth / image.naturalHeight
    : 0;
}

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setMatches(false);
      return;
    }
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    // Safari < 14
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, [query]);
  return matches;
}

/** Catches WebGL context creation failures (R3F rethrows them during render). */
class WebGLErrorBoundary extends Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type ParallaxSceneProps = {
  textures: LoadedTextures;
  engine: MotionEngine;
  settingsRef: React.MutableRefObject<ParallaxSettings>;
  /** True once the canvas has fully faded in over the static image. */
  revealed: boolean;
  onReady: () => void;
  onFail: () => void;
};

const ParallaxScene = ({
  textures,
  engine,
  settingsRef,
  revealed,
  onReady,
  onFail,
}: ParallaxSceneProps) => {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const readyRef = useRef(false);
  // Reveal gain: 0 renders the exact static-image pose (no shift, zoom 1), so the cross-fade is
  // invisible even when the pointer is already engaged. Eases to 1 once the canvas is fully opaque.
  // Per mount, so every remount (context loss, new src) starts at rest again.
  const revealRef = useRef({ value: 0, last: 0 });

  useEffect(() => {
    if (revealed) invalidate();
  }, [revealed, invalidate]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: textures.color },
          uPlate: { value: textures.plate },
          uLayers: { value: textures.layers },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uUvScale: { value: new THREE.Vector2(1, 1) },
          uStrength: { value: 0 },
          uFocus: { value: 0.5 },
          uImageAspect: { value: textures.imageAspect },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [textures]
  );

  useEffect(() => () => material.dispose(), [material]);

  // While this scene is mounted, it drives the motion loop.
  useEffect(() => {
    engine.setInvalidate(invalidate);
    invalidate();
    return () => engine.setInvalidate(null);
  }, [engine, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = () => onFail();
    canvas.addEventListener("webglcontextlost", handleContextLost);
    const previousHandler = gl.debug.onShaderError;
    gl.debug.onShaderError = (context, program, vs, fs) => {
      console.error(
        "DepthParallaxImage: shader failed, falling back to the static image.",
        context.getShaderInfoLog(vs),
        context.getShaderInfoLog(fs),
        context.getProgramInfoLog(program)
      );
      onFail();
    };
    return () => {
      // Removed before R3F's unmount calls forceContextLoss, so teardown is not mistaken for a failure.
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      gl.debug.onShaderError = previousHandler;
    };
  }, [gl, onFail]);

  useFrame((state) => {
    const motion = engine.state;
    if (motion.animating && engine.step(performance.now())) state.invalidate();

    const settings = settingsRef.current;
    const reveal = revealRef.current;
    if (revealed && reveal.value < 1 && motion.x === 0 && motion.y === 0 && motion.e === 0) {
      // At rest the gain has no visible effect, so skip the ramp and its frames.
      reveal.value = 1;
    } else if (revealed && reveal.value < 1) {
      // Same damping as the motion engine; the first step uses 1/60 s instead of the idle gap.
      const now = performance.now();
      const dt =
        reveal.last > 0 ? clamp((now - reveal.last) / 1000, 0, MAX_FRAME_DT) : 1 / 60;
      reveal.last = now;
      reveal.value += (1 - reveal.value) * (1 - Math.exp(-dt * settings.smoothing));
      if (1 - reveal.value < SETTLE_EPSILON) reveal.value = 1;
      else state.invalidate();
    }
    // Only the shader is gated. The CSS tilt stays live because both layers share the tilted card.
    const g = reveal.value;

    const uniforms = material.uniforms;
    uniforms.uPointer.value.set(motion.x * g, motion.y * g);
    uniforms.uStrength.value = settings.strength;
    uniforms.uFocus.value = settings.focus;
    computeUvScale(
      uniforms.uUvScale.value,
      state.size.width / state.size.height,
      textures.imageAspect,
      settings,
      g * Math.max(motion.e, Math.abs(motion.x)),
      g * Math.max(motion.e, Math.abs(motion.y))
    );

    if (!readyRef.current) {
      readyRef.current = true;
      // This callback runs just before the first render; report ready on the next frame, after the
      // pixels (or a shader error) exist.
      requestAnimationFrame(onReady);
    }
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};

export type DepthParallaxImageProps = {
  /**
   * The photo: color of the subject layer, and exactly what the canvas shows at rest. Must be sRGB
   * (see the color management note above). `plateSrc` and `layersSrc` must be pixel-aligned with it
   * (same framing and aspect ratio; any resolution).
   */
  src: string;
  /**
   * Background plate: the photo with the subject removed and the hole inpainted. sRGB like `src`, and
   * identical to it outside the subject. Moving the subject only ever uncovers a thin band just inside
   * its outline, so that band needs a careful fill and the deep interior only a plausible one.
   */
  plateSrc: string;
  /**
   * Layer data, read as raw values (not color): an 8-bit RGB PNG with no alpha channel and no
   * iCCP/gAMA/sRGB/cHRM chunks. Each channel maps 0..255 to 0..1, depths use 1 = near and 0 = far.
   *   R: background depth, defined everywhere. Behind the subject it smoothly continues the
   *      surrounding background depth, and it always stays below the subject's depth.
   *   G: subject alpha matte, 1 = subject. Soft anti-aliased edges, no background inside it.
   *   B: subject depth, defined everywhere and extended smoothly past the matte, so lookups just
   *      outside the subject's edges stay stable.
   */
  layersSrc: string;
  /** Static image for SSR, first paint and every fallback path. Defaults to `src`. */
  fallbackSrc?: string;
  alt: string;
  /** Outer box sizing and rounding, e.g. "w-[270px] h-[387px] rounded-[40px]". */
  className?: string;
  /** Forwarded to next/image. */
  width: number;
  height: number;
  priority?: boolean;
  loading?: "eager" | "lazy";
  quality?: number;
  sizes?: string;
  /** Parallax UV shift per unit of depth from the focus plane at full pointer deflection. */
  strength?: number;
  /**
   * Depth of the pivot plane, 0 (far) to 1 (near). Content at this depth does not move. Set it to the
   * subject's face depth (the B channel there) to keep the face anchored.
   */
  focus?: number;
  /** Card tilt at full pointer deflection, in degrees. */
  maxTiltDeg?: number;
  /** CSS perspective distance in px. */
  perspective?: number;
  /** Exponential damping rate in 1/s. Higher follows the pointer more tightly. */
  smoothing?: number;
  /** Auto-orbit amplitude on touch / no-hover devices, in pointer units (0 to 1). */
  orbitAmplitude?: number;
};

export const DepthParallaxImage = ({
  src,
  plateSrc,
  layersSrc,
  fallbackSrc,
  alt,
  className,
  width,
  height,
  priority,
  loading,
  quality,
  sizes,
  strength = 0.035,
  focus = 0.78,
  maxTiltDeg = 7,
  perspective = 900,
  smoothing = 6,
  orbitAmplitude = 0.5,
}: DepthParallaxImageProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<ParallaxSettings>({
    strength,
    focus: clamp(focus, 0, 1),
    maxTiltDeg,
    smoothing,
    orbitAmplitude: clamp(orbitAmplitude, 0, 1),
  });
  const [engine] = useState(() => createMotionEngine(cardRef, settingsRef));

  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const noHover = useMediaQuery(NO_HOVER_QUERY);
  const [textures, setTextures] = useState<LoadedTextures | null>(null);
  const [status, setStatus] = useState<GLStatus>("pending");

  // null means "not known yet" (SSR and the first client render): stay static until it is.
  const motionAllowed = reducedMotion === false;
  const hoverInteractive = motionAllowed && noHover === false;
  const hoverInteractiveRef = useRef(hoverInteractive);
  hoverInteractiveRef.current = hoverInteractive;

  useEffect(() => () => engine.dispose(), [engine]);

  useEffect(() => {
    settingsRef.current = {
      strength,
      focus: clamp(focus, 0, 1),
      maxTiltDeg,
      smoothing,
      orbitAmplitude: clamp(orbitAmplitude, 0, 1),
    };
    // Re-render with the new settings; under reduced motion the card keeps no transform at all.
    if (reducedMotion === false) engine.kick();
  }, [engine, reducedMotion, strength, focus, maxTiltDeg, smoothing, orbitAmplitude]);

  useEffect(() => {
    if (reducedMotion) engine.reset();
  }, [engine, reducedMotion]);

  // Load all three textures before creating a WebGL context at all. Any failure keeps the static image.
  useEffect(() => {
    if (!motionAllowed) return;
    let cancelled = false;
    let loaded: LoadedTextures | null = null;
    setStatus("pending");
    const loader = new THREE.TextureLoader();
    const requests = [src, plateSrc, layersSrc].map((url) => loader.loadAsync(url));
    // Frees every texture of an abandoned set, including ones that finish loading later.
    const disposeRequests = () => {
      for (const request of requests) {
        request.then(
          (texture) => texture.dispose(),
          () => {}
        );
      }
    };
    Promise.all(requests).then(
      ([color, plate, layers]) => {
        if (cancelled) {
          disposeRequests();
          return;
        }
        const imageAspect = imageAspectOf(color);
        const misaligned = [plate, layers].some((texture) => {
          const aspect = imageAspectOf(texture);
          return (
            imageAspect > 0 &&
            aspect > 0 &&
            Math.abs(aspect / imageAspect - 1) > ASPECT_TOLERANCE
          );
        });
        if (misaligned) {
          console.error(
            "DepthParallaxImage: plate and layers must match the aspect ratio of src, falling back to the static image."
          );
          disposeRequests();
          setStatus("failed");
          return;
        }
        prepareTexture(color);
        prepareTexture(plate);
        prepareTexture(layers);
        loaded = {
          color,
          plate,
          layers,
          imageAspect: imageAspect > 0 ? imageAspect : 3 / 4,
        };
        setTextures(loaded);
      },
      () => {
        disposeRequests();
        if (!cancelled) setStatus("failed");
      }
    );
    return () => {
      cancelled = true;
      if (loaded) {
        loaded.color.dispose();
        loaded.plate.dispose();
        loaded.layers.dispose();
      }
      setTextures(null);
    };
  }, [motionAllowed, src, plateSrc, layersSrc]);

  const handleReady = useCallback(
    () => setStatus((current) => (current === "pending" ? "ready" : current)),
    []
  );
  const handleFail = useCallback(() => setStatus("failed"), []);

  // Flips once the opacity transition has finished. A timer rather than transitionend, which can be
  // skipped (hidden tab, interrupted transition). Effects run after paint, so the fade has already
  // started when the timer does.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (status !== "ready") {
      setRevealed(false);
      return;
    }
    const id = window.setTimeout(() => setRevealed(true), FADE_MS);
    return () => window.clearTimeout(id);
  }, [status]);

  // Touch / no-hover: slow auto-orbit while on screen, paused (frozen) while off screen. Held back
  // until the canvas has finished fading in (or WebGL failed), so it starts from rest on a fully
  // opaque canvas.
  const orbitEnabled =
    motionAllowed && noHover === true && (revealed || status === "failed");
  useEffect(() => {
    const element = wrapperRef.current;
    if (!orbitEnabled || !element) return;
    const motion = engine.state;
    const setOrbiting = (on: boolean) => {
      if (motion.orbiting === on) return;
      motion.orbiting = on;
      engine.kick();
    };
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      setOrbiting(true);
    } else {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setOrbiting(entry.isIntersecting);
      });
      observer.observe(element);
    }
    return () => {
      observer?.disconnect();
      motion.orbiting = false;
      motion.tx = 0;
      motion.ty = 0;
      motion.te = 0;
      engine.kick();
    };
  }, [engine, orbitEnabled]);

  const handlePointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Touch never drives the effect, so it can never interfere with scrolling.
      if (event.pointerType === "touch" || !hoverInteractiveRef.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const motion = engine.state;
      motion.tx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      motion.ty = clamp(1 - ((event.clientY - rect.top) / rect.height) * 2, -1, 1);
      motion.te = 1;
      engine.kick();
    },
    [engine]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch" || !hoverInteractiveRef.current) return;
      const motion = engine.state;
      motion.tx = 0;
      motion.ty = 0;
      motion.te = 0;
      engine.kick();
    },
    [engine]
  );

  const showCanvas = motionAllowed && textures !== null && status !== "failed";

  return (
    <div
      ref={wrapperRef}
      // pointer-events-auto: the hero renders this under pointer-events-none ancestors.
      className={cn("relative pointer-events-auto", className)}
      style={{ perspective: `${perspective}px` }}
      onPointerEnter={handlePointer}
      onPointerMove={handlePointer}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div
        ref={cardRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: "inherit",
          transformOrigin: "50% 50%",
          willChange: "transform",
          // Safari drops overflow/border-radius clipping of composited children (the WebGL canvas)
          // inside 3D-transformed boxes. An isolated stacking context plus a no-op mask restores it.
          isolation: "isolate",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          backfaceVisibility: "hidden",
        }}
      >
        <Image
          src={fallbackSrc ?? src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={loading}
          quality={quality}
          sizes={sizes}
          // The wrapper now receives pointer events, so stop native image drag from hijacking hover.
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {showCanvas && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: status === "ready" ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-out`,
            }}
          >
            <WebGLErrorBoundary onError={handleFail}>
              <Canvas
                frameloop="demand"
                dpr={[1, 2]}
                flat
                linear
                gl={{
                  alpha: true,
                  antialias: false,
                  depth: false,
                  stencil: false,
                  powerPreference: "low-power",
                }}
                // offsetSize: measure layout size, not the tilted card's projected bounding box.
                resize={{ scroll: false, offsetSize: true }}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                <ParallaxScene
                  textures={textures}
                  engine={engine}
                  settingsRef={settingsRef}
                  revealed={revealed}
                  onReady={handleReady}
                  onFail={handleFail}
                />
              </Canvas>
            </WebGLErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};
