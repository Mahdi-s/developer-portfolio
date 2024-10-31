"use client";
import React, { useEffect, useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Navbar } from "@/components/navbar";
import ProjectCards from "@/components/project_cards";
import Image from "next/image";

export function WelcomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Add useEffect for mobile detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
  
    // Set the initial value
    setIsMobile(mediaQuery.matches);
  
    // Add the listener
    mediaQuery.addEventListener('change', handleMediaQueryChange);
  
    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  // Handle scroll for desktop view
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (window.innerWidth >= 768) { // desktop breakpoint
        const rightColumn = document.getElementById('right-column');
        if (rightColumn) {
          e.preventDefault();
          rightColumn.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  const words = [
    {
      text: "Email",
      className: "text-black dark:text-gray-400 font-quicksand",
    },
    {
      text: ":",
      className: "text-black dark:text-gray-400 font-quicksand",
    },
    {
      text: "mahdisaeediv@gmail.com",
      className: "text-gray-700 dark:text-gray-700 font-quicksand",
    },
    ];


  return (
    <div className="h-screen relative w-full overflow-hidden md:overflow-hidden bg-gray-400">
      {/* Move content below background elements */}
      {/* Background elements in a separate container */}
      <div className="absolute inset-0 pointer-events-none">
        <Boxes className="pointer-events-auto" />
        <div id="box-mask" className="absolute inset-0 w-full h-full bg-gray-300 [mask-image:linear-gradient(to_left,transparent_80%,gray)] pointer-events-none" />
      </div>

      <motion.a
        href="https://github.com/Mahdi-s/developer-portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 z-50 h-12 w-12 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 pointer-events-auto text-black"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(115, 115, 115)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
      </motion.a>


      
        {/* Conditional rendering for mobile/desktop layouts */}
        {isMobile ? (
        <div className="absolute inset-0 z-30 overflow-auto">
          <div className="p-8 flex flex-col bg-transparent">
            {/* Navbar */}
            
              <Navbar/>
            
            {/* Welcome text */}
            <div className="flex-1 flex flex-col justify-center items-center text-center mb-8">

                <motion.h1
                    className={cn(
                      "text-4xl text-gray-900 mb-4 font-quicksand font-bold"
                    )}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Mahdi Saeedi
                </motion.h1>

                <motion.p
                  className="text-gray-800 mb-4 px-4 max-w-2xl mx-auto font-quicksand"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ wordWrap: "break-word" }}
                >
                  Senior Software Engineer
                </motion.p>

                <motion.div
                    className="mb-4 px-4 max-w-2xl mx-auto"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
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
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ wordWrap: "break-word" }}
                >
                      Welcome to my corner of the internet. 
                      I&apos;m an AI developer making lawyers more efficient using GenAI.
                      I read machine learning papers and build tools to help with my work. 
                      I like icecream, solo backpacking, and suanas.
                      If anything peaks your interest, feel free to reach out.
                </motion.p>

                <motion.div
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.7 }}
                  className="pointer-events-auto"
                >
                  <TypewriterEffectSmooth words={words} />
                </motion.div>
              {/* <p className="text-blue-400">email@example.com</p> */}
            </div>
            {/* Project cards */}
            <div className="w-full">
              <ProjectCards />
            </div>
          </div>
        </div>
      ) : (
      <div id="parent-container" className="absolute inset-0 z-30 pointer-events-none md:overflow-hidden overflow-auto">
        {/* Responsive grid container */}
        <div className="h-full w-full grid md:grid-cols-2 grid-cols-1 pointer-events-none gap-x-4 px-8">
          {/* Left column */}
          <div className="p-8 flex flex-col bg-transparent md:h-screen overflow-auto relative overflow-auto pointer-events-none">
            
            {/* Welcome text and Navbar*/}
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  {/* Navbar */}
                  <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.1 }}
                  >
                    <div className="w-full mb-6 overflow-visible relative z-50 pointer-events-auto">
                      <Navbar/>
                    </div>

                  </motion.div>
                  {/* Welcome text */}

                  <div id="welcome" className="flex flex-row items-center gap-6">

                  <motion.div
                      className="flex-shrink-0"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.7 }}
                  >
                      <Image 
                          src="/images/headshot.png"
                          alt="Mahdi Saeedi"
                          width={480}
                          height={600}
                          className="rounded-2xl w-[40vmin] h-[50vmin] max-w-[30rem] max-h-[40rem] object-cover"
                      />
                  </motion.div>

                  <div className="flex flex-col">

                  <motion.h1
                    className={cn(
                      "text-4xl text-gray-900 mb-4 text-left font-quicksand font-bold"
                    )}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Mahdi Saeedi
                  </motion.h1>

                  <motion.p
                    className= "text-gray-800 mb-4  max-w-2xl text-left  font-quicksand"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ wordWrap: "break-word" }}
                  >
                    Senior Software Engineer
                  </motion.p>


                  <motion.p
                    className="text-gray-800 mb-4  max-w-2xl text-left mx-auto font-quicksand"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    style={{ wordWrap: "break-word" }}
                  >
                      Welcome to my corner of the internet. 
                      I&apos;m an AI developer making lawyers more efficient using GenAI.
                      I read machine learning papers and build tools to help with my work. 
                      I like icecream, solo backpacking, and suanas.
                      If anything peaks your interest, feel free to reach out.
                  </motion.p>

                  </div>

                  </div>


                <motion.div
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 1.3 }}
                  className="pointer-events-auto"
                >
                  <TypewriterEffectSmooth words={words} />
                </motion.div>

                </div>

          </div>

              {/* Right column */}
              <div 
                id="right-column"
                className="md:h-full overflow-y-auto scrollbar-hide"
              >
                <div className="p-8">
                  <ProjectCards />
                </div>
              </div>

        </div>
      </div>
      )}
    </div>
  );
}