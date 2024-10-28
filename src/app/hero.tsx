"use client";
import React, { useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { motion, useScroll } from "framer-motion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Navbar } from "@/components/navbar";
import ProjectCards from "@/components/project_cards";


export function WelcomePage() {
  const { scrollYProgress } = useScroll();

  const words = [
    {
      text: "Email",
      className: "font-quicksand text-white-100 dark:text-white-100 text-4xl",
    },
    {
      text: ":",
      className: "font-quicksand text-white-100 dark:text-white-100 text-4xl",
    },
    {
      text: "mahdisaeediv@gmail.com",
      className: "font-quicksand text-blue-200 dark:text-blue-200 text-4xl",
    },
  ];

  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes/>

      <div className="h-screen w-full flex flex-col md:flex-row overflow-y-auto md:overflow-hidden px-6 md:px-12 py-8">
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-12"
        >

            <Navbar/>

            <motion.h1
              className={cn(
                "font-quicksand text-center text-3xl md:text-5xl text-white relative z-20 pointer-events-none flex flex-col gap-4"
              )}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0 }}
            >
              <span>Mahdi Saeedi&apos;s Portfolio</span>
              <span>Thanks for stopping by!</span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-4"
          >
            <div className="pointer-events-none">
              <motion.h2
                className="font-quicksand text-center text-sm md:text-2xl text-neutral-300 relative z-20 pointer-events-none justify-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ wordWrap: "break-word" }}
              >
              <span>Welcome to my corner of the internet, I like to tinker with Larger Langugage models, </span>
              <span>Create simulations on elections and redistricing in America, </span>
              <span>and create AI educational content.</span>
              </motion.h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="pointer-events-auto z-0 md:z-30"
            >
            <TypewriterEffectSmooth words={words} />
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto md:overflow-y-scroll right-side-div scrollbar-hide">
            <div className="w-full h-full px-4">
                <ProjectCards />
            </div>
        </div>

      </div>
    </div>
  );
}
