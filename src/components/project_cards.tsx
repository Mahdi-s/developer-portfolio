import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { projectData } from "./projectData";

export default function ProjectCards() {
  const gridRef = useRef(null);

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
                        src={project.image}
                        height="800"
                        width="800"
                        className="h-full w-full object-cover rounded-[40px] group-hover/card:shadow-xl"
                        alt={project.title}
                      />
                    </CardItem>
                    <CardItem
                      translateZ="40"
                      className="text-sm font-bold font-mono text-neutral-600 dark:text-white"
                    >
                      Tech Stack: {project.techStack.join(", ")}
                    </CardItem>
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-wrap justify-between items-center mt-4">
                    {project.links.map((link, btnIndex) => (
                      <CardItem
                        key={btnIndex}
                        translateZ={40}
                        as={Link}
                        href={link.url}
                        target="__blank"
                        className="px-3 py-1 m-1 rounded-[40px] bg-[#4f6b8b] dark:bg-white dark:text-black text-white text-xs font-bold-mono flex items-center justify-center"
                      >
                        {link.icon}
                      </CardItem>
                    ))}
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
