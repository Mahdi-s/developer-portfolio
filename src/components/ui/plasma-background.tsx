"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
#define PLASMA_AMPLITUDE 32767.0
#define WAVE_FREQUENCY 0.0001
#define PALETTE_NORMALIZER 0.00390625
#define COLOR_QUANTIZATION 256.0
#define SPEED 1.8

// --- Settings ---
#define MOUSE_REPULSION_STRENGTH 0.5  // Strength of the distortion/push
#define BACKGROUND_SPARSITY 0.8      // Increased sparsity for more black background

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

float calculatePlasmaWave(float phase){return cos(phase*WAVE_FREQUENCY)*PLASMA_AMPLITUDE+PLASMA_AMPLITUDE;}
vec3 convertHsvToRgb(vec3 hsv){vec3 rgb=clamp(abs(mod(hsv.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);rgb=rgb*rgb*(3.0-2.0*rgb);return hsv.z*mix(vec3(1.0),rgb,hsv.y);}
// New 16-color palette: dark, saturated colors that complement project boxes (#c7cbd4) and white text
// Colors range from very dark blues/purples to rich teals, cyans, magentas, and violets
vec3 getPaletteColor(int s) {
    if (s == 0) return vec3(0.05, 0.05, 0.15);      // Very dark blue (replaces black)
    if (s == 1) return vec3(0.15, 0.1, 0.3);         // Deep indigo
    if (s == 2) return vec3(0.4, 0.15, 0.5);         // Rich purple
    if (s == 3) return vec3(0.6, 0.2, 0.5);          // Deep magenta
    if (s == 4) return vec3(0.3, 0.1, 0.4);          // Dark violet
    if (s == 5) return vec3(0.2, 0.3, 0.7);          // Deep blue
    if (s == 6) return vec3(0.1, 0.5, 0.6);           // Rich teal
    if (s == 7) return vec3(0.0, 0.6, 0.8);          // Cyan
    if (s == 8) return vec3(0.25, 0.15, 0.45);        // Dark blue-purple
    if (s == 9) return vec3(0.45, 0.2, 0.55);         // Deep purple
    if (s == 10) return vec3(0.65, 0.25, 0.6);        // Rich magenta
    if (s == 11) return vec3(0.0, 0.4, 0.5);           // Deep teal
    if (s == 12) return vec3(0.2, 0.25, 0.65);         // Indigo-blue
    if (s == 13) return vec3(0.5, 0.2, 0.5);          // Purple-magenta
    if (s == 14) return vec3(0.35, 0.4, 0.75);         // Bright blue-purple
    if (s == 15) return vec3(0.1, 0.55, 0.7);          // Bright teal-cyan
    return vec3(0.1, 0.1, 0.2);                      // Fallback dark blue
}
vec3 sampleColorPalette(float t){t=fract(t)*16.0;int s=int(t);return mix(getPaletteColor(s),getPaletteColor((s+1)%16),smoothstep(0.0,1.0,fract(t)));}

void main() {
    float time = iTime * SPEED;
    // fragCoord is gl_FragCoord.xy
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 screenUV = fragCoord / iResolution.xy;
    float aspectRatio = min(iResolution.x, iResolution.y);
    
    // 1. Clean, Undistorted Coordinates
    vec2 aspectCorrectedCoord = (screenUV - 0.5) * iResolution.xy / aspectRatio + 0.5;
    
    // 2. Mouse Interaction Physics
    // iMouse in shadertoy is typically pixel coords. Here we pass pixel coords too.
    vec2 mouseAspect = (iMouse.xy / iResolution.xy - 0.5) * iResolution.xy / aspectRatio + 0.5;
    vec2 fromMouse = aspectCorrectedCoord - mouseAspect;
    float distToMouse = length(fromMouse);

    // Calculate Repulsion (Distortion Field)
    float repulsion = smoothstep(0.5, 0.0, distToMouse);
    vec2 repulsionOffset = normalize(fromMouse) * repulsion * MOUSE_REPULSION_STRENGTH;
    
    // Only apply repulsion if mouse is roughly on screen (handled via JS mouse tracking generally, but here we just check if it's not default 0,0 or similar if needed. 
    // However, the shader logic if (iMouse.x <= 1.0 && iMouse.y <= 1.0) repulsionOffset = vec2(0.0); from shadertoy implies if mouse is not clicked/active in some contexts.
    // We will pass -1,-1 or similar when inactive, or just let it be 0,0.
    // The user logic:
    if (iMouse.x <= 1.0 && iMouse.y <= 1.0) repulsionOffset = vec2(0.0);

    // 3. Plasma Coordinates (Warped)
    vec2 plasmaCoord = aspectCorrectedCoord - repulsionOffset;

    // 4. Color Generation (Using Warped Coordinates)
    // Removed grid quantization for higher resolution/smooth effect
    vec2 plasmaGridCenter = plasmaCoord;

    vec4 timeOscillators = vec4(sin(time * vec2(0.05, 0.027)), cos(time * vec2(0.013, 0.08)));
    vec2 animatedGridCenter = (plasmaGridCenter + vec2(dot(timeOscillators, vec4(0.3, 0.8, 0.15, 0.2)), dot(timeOscillators.wzxy, vec4(0.12, 0.6, sin(time * 0.019), cos(time * 0.031)))) - 0.5) * (0.35 + sin(time * 0.1) * 0.12);
    
    float c = cos(time * 0.0195), s = sin(time * 0.0195);
    vec2 rotatedCoordinate = (mat2(c, -s, s, c) * animatedGridCenter + 0.5) * 180.0;
    
    vec4 plasmaTimeOscillators = mod(vec4(sin(time * 0.23), cos(time * 0.15), sin(time * 0.28), cos(time * 0.17)) * 20000.0 + 32768.0, 65536.0);
    vec4 plasmaPhaseAngles = vec4(plasmaTimeOscillators.x * 0.3 + rotatedCoordinate.x * 367.0, 8192.0 + rotatedCoordinate.x * 453.0, plasmaTimeOscillators.z * 0.3 + rotatedCoordinate.y * 472.0, 4096.0 + rotatedCoordinate.y * 419.0);
    vec4 plasmaWaveValues = cos(plasmaPhaseAngles * WAVE_FREQUENCY) * PLASMA_AMPLITUDE + PLASMA_AMPLITUDE;
    vec2 interferencePattern = (vec2(plasmaPhaseAngles.w, plasmaPhaseAngles.y) + vec2(plasmaWaveValues.x, plasmaWaveValues.w)) * PALETTE_NORMALIZER * 0.5;
    float palettePosition = mod(dot(vec4(calculatePlasmaWave(interferencePattern.x * COLOR_QUANTIZATION), calculatePlasmaWave(interferencePattern.y * COLOR_QUANTIZATION), plasmaWaveValues.yz), vec4(0.25)), 65536.0);
    float normalizedPaletteIndex = palettePosition * PALETTE_NORMALIZER / 255.0;

    // Restore breathing effect for color movement
    float breathingEffect = 0.02 + 0.372 * pow(sin(time * 0.03) * 0.5 + 0.5, 2.0);
    float animatedPaletteIndex = normalizedPaletteIndex + breathingEffect * sin(normalizedPaletteIndex * 6.283) * 0.25;
    
    vec3 baseColor = sampleColorPalette(animatedPaletteIndex);
    
    // --- Rarity Filter ---
    // With dark colors, simple dot product brightness might be too low, causing everything to be masked out.
    // We need to adjust the brightness calculation or the threshold.
    // Let's use max channel brightness instead of average to preserve vibrant colors.
    float brightness = max(baseColor.r, max(baseColor.g, baseColor.b));
    
    // Adjust rarity mask to be more permissive with dark colors
    float rarityMask = smoothstep(BACKGROUND_SPARSITY - 0.1, BACKGROUND_SPARSITY + 0.1, brightness);
    vec3 finalColor = baseColor * rarityMask; 
    
    // --- Glossy Enhancement ---
    // Increase saturation for richer, more vibrant colors
    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
    vec3 saturatedColor = mix(vec3(luminance), finalColor, 1.15);
    
    // Add brightness boost to highlights for glossy sheen
    float highlightBoost = smoothstep(0.3, 0.7, brightness) * 0.15;
    finalColor = saturatedColor + highlightBoost;
    
    // Apply subtle color intensity curve for glossy reflective quality
    finalColor = pow(finalColor, vec3(0.95));
    
    // Add subtle noise (reduced for cleaner appearance)
    finalColor += (fract(sin(dot(fragCoord * 0.1, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.002;
    
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const PlasmaMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport, gl } = useThree();

  // Mouse position state
  const mouseRef = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      iMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  // Update uniforms on frame
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const pixelRatio = state.gl.getPixelRatio();

      material.uniforms.iTime.value = state.clock.getElapsedTime();
      material.uniforms.iResolution.value.set(
        state.size.width * pixelRatio,
        state.size.height * pixelRatio
      );
      material.uniforms.iMouse.value.set(
        mouseRef.current.x * pixelRatio,
        mouseRef.current.y * pixelRatio
      );
    }
  });

  // Global mouse listener to track mouse even when over other elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Flip Y to match shader expectations if needed, but usually pixel coords are top-left in DOM 
      // and bottom-left in GL. 
      // Shader uses: iMouse.xy / iResolution.xy
      // GL coords: (0,0) bottom-left. DOM: (0,0) top-left.
      // Let's convert to GL coords: x, height - y
      mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const PlasmaBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: false, powerPreference: "high-performance" }}
      >
        <PlasmaMesh />
      </Canvas>
    </div>
  );
};

