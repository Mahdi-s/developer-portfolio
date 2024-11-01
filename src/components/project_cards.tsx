// project_cards.tsx
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { projectData } from "./projectData";

export default function ProjectCards() {
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef(null);

  // Move useScroll outside of conditional
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });
  
  const translateYValues = Array(projectData.length).fill(null).map((_, i) => {
    return useTransform(
      scrollYProgress,
      [0, 1],
      [0, -100 + i * 20]
    );
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Set the initial value
    setIsMobile(mediaQuery.matches);

    // Add the listener
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup listener on unmount
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <div ref={gridRef} className="w-full h-full overflow-y-auto scrollbar-hide">
      {/* Conditionally render based on isMobile */}
      {isMobile ? (
        <div className="w-full h-full">
          <div className="grid grid-cols-1 gap-2 p-1 w-full">
            {projectData.map((project, index) => (
              <div key={index} className="h-full">
                <CardContainer className="inter-var h-full w-full pointer-events-auto">
                  <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border">
                    <div className="flex-1">
                      <CardItem
                        className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                      >
                        {project.description}
                      </CardItem>
                      <CardItem className="w-full h-84 relative mb-2">
                        <Image
                          src={project.image.src}
                          height="800"
                          width="800"
                          className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt={project.image.alt}
                        />
                      </CardItem>
                      <CardItem
                        className="text-sm font-bold text-neutral-600 dark:text-white"
                      >
                        Tech Stack: {project.techStack}
                      </CardItem>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      {project.buttons.map((button, btnIndex) => (
                        <CardItem
                          key={btnIndex}
                          as={Link}
                          href={button.href}
                          target="__blank"
                          className="px-3 py-1 m-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                        >
                          {button.label}
                        </CardItem>
                      ))}
                    </div>
                  </CardBody>
                </CardContainer>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="w-full h-full"
        >
          <motion.div className="grid grid-cols-1 gap-2 p-1 w-full">
            {projectData.map((project, index) => (
              <motion.div
                key={index}
                style={{ y: translateYValues[index % translateYValues.length] }}
                className="h-full"
              >
                <CardContainer className="inter-var h-full w-full pointer-events-auto">
                  <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                  <div className="flex-1">
                      <CardItem
                        translateZ="50"
                        className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                      >
                        {project.description}
                      </CardItem>
                      <CardItem
                        translateZ="100"
                        className="w-full h-84 relative mb-2"
                      >
                        <Image
                          src={project.image.src}
                          height="800"
                          width="800"
                          className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt={project.image.alt}
                        />
                      </CardItem>
                      <CardItem
                        translateZ="50"
                        className="text-sm font-bold text-neutral-600 dark:text-white"
                      >
                        Tech Stack: {project.techStack}
                      </CardItem>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      {project.buttons.map((button, btnIndex) => (
                        <CardItem
                          key={btnIndex}
                          translateZ={20}
                          as={Link}
                          href={button.href}
                          target="__blank"
                          className="px-3 py-1 m-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                        >
                          {button.label}
                        </CardItem>
                      ))}
                    </div>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
