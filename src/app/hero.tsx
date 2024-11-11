"use client";
import React, { useEffect, useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Navbar } from "@/components/navbar";
import ProjectCards from "@/components/project_cards";
import Image from "next/image";
import { IoCodeOutline } from "react-icons/io5";


export function WelcomePage() {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const cvLink = "https://drive.google.com/file/d/1jFk-zz57WI1jg-ut9PMiFbzLcweICLs8/view?usp=sharing"

  // Early mobile detection
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimized scroll handling
  useEffect(() => {
    if (isMobile) return; // Don't attach scroll handler on mobile
    
    const rightColumn = document.getElementById("right-column");
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (rightColumn) {
        const newScrollTop = rightColumn.scrollTop + e.deltaY;
        requestAnimationFrame(() => {
          rightColumn.scrollTop = newScrollTop;
        });
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [isMobile]);

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const words = [
    {
      text: "mahdisaeediv@gmail.com",
      className: "text-gray-700 dark:text-gray-700 font-quicksand",
    },
  ];

  // Optimized animation variants
  const variants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 20 }
    },
  };

  const smallVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
  };

  // Render content based on client-side detection
  const renderContent = () => {
    if (!isClient) {
      return (
        <div className="h-screen w-full bg-gray-400 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 border-t-4 border-r-4 border-gray-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          ></motion.div>
        </div>
      );
    }

    // Rest of your existing conditional rendering logic
    return isMobile ? (
      // Your existing mobile JSX
      <>
      <div className="absolute inset-0">
        <div
          id="box-mask"
          className="absolute inset-0 w-full h-full bg-gray-300"
        />
      </div>

      <div className="absolute inset-0 z-30 overflow-auto">
        <div className="p-8 flex flex-col bg-transparent">

          {/* Welcome text */}
          <div className="flex-1 flex flex-col justify-center items-center text-center mb-8">

          <a
          href="https://github.com/Mahdi-s/developer-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-4 z-50 h-12 w-12 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 text-black flex items-center justify-center"
          >
              <IoCodeOutline size={20} />
        </a>


          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-transparent p-8">
                <Navbar />
          </div>

            <motion.h1
              className={cn(
                "text-4xl text-gray-900 mb-4 font-quicksand font-bold"
              )}
              style={{ wordWrap: "break-word" }}
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Mahdi Saeedi
            </motion.h1>

            <motion.p
              className="text-gray-800 mb-4 px-4 max-w-2xl mx-auto font-quicksand"
              style={{ wordWrap: "break-word" }}
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Senior Software Engineer
            </motion.p>

            <motion.div
              className="mb-4 px-4 max-w-2xl mx-auto"
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={smallVariants}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Image
                src="/images/headshot.png"
                alt="Mahdi Saeedi"
                width={192}
                height={192}
                className="rounded-2xl object-cover mx-auto"
              />
            </motion.div>

            <motion.p
              className="text-gray-800 mb-4 px-4 max-w-2xl mx-auto font-quicksand"
              style={{ wordWrap: "break-word" }}
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 1, delay: 0.5 }}
            >
                    Welcome to my corner of the internet. I&apos;m an AI developer
                    making lawyers more efficient using GenAI. Nowadays, I read machine learning papers and dream about the future. 
                    I love to open-source my work. I like ice cream on hot summer days. 
                    I want to solo-backpack every country before I die, sitting at 21/195. 
                    I love Suanas; it helps me stay sane. 
                    Feel free to reach out.{" "}
                    <a 
                      href={cvLink}
                      className="text-blue-600 hover:text-blue-800 underline pointer-events-auto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View My CV
                    </a>
            </motion.p>

            <motion.div
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 0.2, delay: 0.6 }}
            >
              <TypewriterEffectSmooth words={words} />
            </motion.div>
          </div>
          {/* Project cards */}
          <motion.div
            className="w-full"
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={smallVariants}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <ProjectCards />
          </motion.div>
        </div>
      </div>
    </>
    ) : (
      <>
      {/* Background elements in a separate container */}
      <div className="absolute inset-0">
        <Boxes className="pointer-events-auto" />
        <div
          id="box-mask"
          className="absolute inset-0 w-full h-full bg-gray-300 [mask-image:linear-gradient(to_left,transparent_80%,gray)] pointer-events-none"
        />
      </div>

      <motion.a
        href="https://github.com/Mahdi-s/developer-portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 z-50 h-12 w-12 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 text-black flex items-center justify-center"
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={variants}
        transition={{ duration: 1, delay: 1.7 }}
      >
        <IoCodeOutline size={20} />
      </motion.a>

      <div
        id="parent-container"
        className="absolute inset-0 z-30 pointer-events-none md:overflow-hidden overflow-auto"
      >
        {/* Responsive grid container */}
        <div className="h-full w-full grid md:grid-cols-2 grid-cols-1 pointer-events-none gap-x-8 px-8">
          {/* Left column */}
          <div className="p-8 flex flex-col bg-transparent md:h-screen overflow-auto relative overflow-auto pointer-events-none overflow-visible">
            {/* Welcome text and Navbar*/}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              {/* Navbar */}
              <motion.div
                className="relative"
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                variants={variants}
                transition={{ duration: 1, delay: 0.1 }}
              >
                <div className="w-full mb-6 overflow-visible relative z-50 pointer-events-auto">
                  <Navbar />
                </div>
              </motion.div>
              {/* Welcome text */}

              <div
                id="welcome"
                className="flex flex-row items-start justify-start gap-8 pl-8 md:pl-12 w-full max-w-7xl mx-auto relative"
                >
                <motion.div
                  className="relative flex-shrink-0 h-auto"
                  initial="hidden"
                  animate={isLoading ? "hidden" : "visible"}
                  variants={variants}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  <Image
                    src="/images/headshot.png"
                    alt="Mahdi Saeedi"
                    width={480}
                    height={600}
                    className="rounded-2xl w-[300px] h-[430px] object-cover" 
                    />
                </motion.div>

                <div className="flex flex-col flex-grow max-w-[500px] overflow-visible space-y-2">
                  <motion.h1
                    className={cn(
                      "text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2 text-left font-quicksand font-bold"
                    )}
                    initial="hidden"
                    animate={isLoading ? "hidden" : "visible"}
                    variants={variants}
                    transition={{ duration: 1, delay: 0.1 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Mahdi Saeedi
                  </motion.h1>

                  <motion.p
                    className="text-sm md:text-base lg:text-lg text-gray-900 mb-2 text-left font-quicksand"
                    initial="hidden"
                    animate={isLoading ? "hidden" : "visible"}
                    variants={variants}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Senior Software Engineer
                  </motion.p>

                  <motion.p
                    className="text-xs md:text-sm lg:text-base text-gray-800 mb-2 text-left font-quicksand break-words overflow-visible" 
                    initial="hidden"
                    animate={isLoading ? "hidden" : "visible"}
                    variants={variants}
                    transition={{ duration: 1, delay: 1.2 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Welcome to my corner of the internet. I&apos;m an AI developer
                    making lawyers more efficient using GenAI. Nowadays, I read machine learning papers and dream about the future. 
                    I love to open-source my work. I like ice cream on hot summer days. 
                    I want to solo-backpack every country before I die, sitting at 21/195. 
                    I love Suanas; it helps me stay sane. 
                    Feel free to reach out.{" "}
                    <a 
                      href={cvLink}
                      className="text-blue-600 hover:text-blue-800 underline pointer-events-auto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View My CV
                    </a>
                  </motion.p>

                  <motion.div
                    initial="hidden"
                    animate={isLoading ? "hidden" : "visible"}
                    variants={variants}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="pointer-events-auto text-sm md:text-base"
                    >
                    <TypewriterEffectSmooth words={words} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <motion.div
            id="right-column"
            className="md:h-full overflow-y-auto scrollbar-hide"
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={smallVariants}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="p-8">
              <ProjectCards />
            </div>
          </motion.div>
        </div>
      </div>
    </>
    );
  };

  return (
    <div 
      className="h-screen relative w-full overflow-hidden bg-gray-400"
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
        WebkitOverflowScrolling: "touch",       
      }}
    >
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-12 h-12 border-t-4 border-r-4 border-gray-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderContent()}
    </div>
  );
}