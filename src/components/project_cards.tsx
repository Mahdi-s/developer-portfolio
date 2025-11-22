import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { projectData } from "./projectData";

export default function ProjectCards({ isMobile }: { isMobile: boolean }) {
  const gridRef = useRef(null);

  // Only use scroll and transforms if not mobile

  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  // Create individual transform values outside of map
  const translateY0 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const translateY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const translateY2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const translateY3 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const translateY4 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const translateY5 = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Store values in array
  const translateYValues = [
    translateY0,
    translateY1,
    translateY2,
    translateY3,
    translateY4,
    translateY5,
  ];


  return (
    <div ref={gridRef} className="w-full h-full overflow-y-auto scrollbar-hide">
      {/* Conditionally render based on isMobile */}
      {isMobile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-2 p-1 w-full">
            {projectData.map((project, index) => (
              <div key={index} className="h-full">
                {/* Simplified mobile card structure */}
                <div className="bg-[#c7cbd4] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-[40px] p-6 border">
                  <div className="flex-1">
                    <h3 className="text-sm font-mono font-bold text-neutral-600 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2">
                      {project.description}
                    </p>
                    <div className="w-full h-84 relative mb-2">
                      <Image
                        src={project.image.src}
                        height={400} // Reduced image size for mobile
                        width={400} // Reduced image size for mobile
                        className="h-full w-full object-cover rounded-[40px]"
                        alt={project.image.alt}
                        loading="lazy" // Add lazy loading
                      />
                    </div>
                    <p className="text-sm font-mono font-bold text-neutral-600 dark:text-white">
                      Tech Stack: {project.techStack}
                    </p>
                  </div>
                  {/* Simplified buttons */}
                  <div className="flex flex-wrap justify-between items-center mt-4">
                    {project.buttons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        href={button.href}
                        target="_blank"
                        className="px-3 py-1 m-1 rounded-[40px] bg-[#4f6b8b] dark:bg-white dark:text-black text-white text-xs font-bold font-mono"
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
                style={{ y: translateYValues[index] }}
                className="w-full"
              >
                <CardContainer className="inter-var h-full w-full pointer-events-auto">
                  <CardBody className="bg-[#c7cbd4] relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-[40px] p-6 border hover:shadow-2xl hover:shadow-neutral-400/50 dark:hover:shadow-neutral-900/50 transition-shadow duration-300 mx-auto">
                    <div className="flex-1">
                      <CardItem
                        translateZ="40"
                        className="text-sm font-mono font-bold text-neutral-600 dark:text-white mb-2"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="40"
                        className="text-xs font-mono text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                      >
                        {project.description}
                      </CardItem>
                      <CardItem
                        translateZ="50"
                        className="w-full h-84 relative mb-2"
                      >
                        <Image
                          src={project.image.src}
                          height="800"
                          width="800"
                          className="h-full w-full object-cover rounded-[40px] group-hover/card:shadow-xl"
                          alt={project.image.alt}
                        />
                      </CardItem>
                      <CardItem
                        translateZ="40"
                        className="text-sm font-bold font-mono text-neutral-600 dark:text-white"
                      >
                        Tech Stack: {project.techStack}
                      </CardItem>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-wrap justify-between items-center mt-4">
                      {project.buttons.map((button, btnIndex) => (
                        <CardItem
                          key={btnIndex}
                          translateZ={40}
                          as={Link}
                          href={button.href}
                          target="__blank"
                          className="px-3 py-1 m-1 rounded-[40px] bg-[#4f6b8b] dark:bg-white dark:text-black text-white text-xs font-bold-mono"
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
