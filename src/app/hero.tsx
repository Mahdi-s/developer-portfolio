"use client";
import React, { useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { motion, useScroll } from "framer-motion";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Navbar from "@/components/navbar";
import ProjectCards from "@/components/project_cards";


export function BackgroundBoxesDemo() {
  const { scrollYProgress } = useScroll();

  const words = [
    {
      text: "Email",
      className: "text-white-100 dark:text-white-100 text-4xl",
    },
    {
      text: ":",
      className: "text-white-100 dark:text-white-100 text-4xl",
    },
    {
      text: "mahdisaeediv@gmail.com",
      className: "text-blue-200 dark:text-blue-200 text-4xl",
    },
  ];

  return (
    <div className="h-screen relative w-full h-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />

      <div className="h-screen flex">
        <div className="flex-1 flex flex-col justify-center items-center text-center pl-40 space-y-3">
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
        <Navbar className="pb-5" />
          <motion.h1
            className={cn(
              "text-center text-5xl text-white relative z-20 pointer-events-none justify-center"
            )}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0 }}
            style={{ wordWrap: "break-word" }}
          >
            
            Mahdi Saeedi&apos;s Portfolio
          </motion.h1>
          </motion.div>


          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="center-lines pointer-events-none">
              <motion.p
                className="text-center text-2xl text-neutral-300 relative z-20 pointer-events-none justify-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ wordWrap: "break-word" }}
              >
                
                Hey! Welcome to my corner of the internet. I like to research <strong>machine learning</strong>, create easy to use<strong>analytic dashboards</strong>, and
                conduct <strong>simulations</strong> on human interactions. This page showcases a sample of my
                work and interests. Feel free to reach out if you have any
                questions or just want to chat.
                
              </motion.p>
            </div>
          </motion.div>

          <br />

          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="pointer-events-auto z-0 md:z-50 pt-10"
          >
            <TypewriterEffectSmooth words={words} />
          </motion.div>

        </div>

        <div className="flex-1 overflow-y-scroll right-side-div flex flex-col items-start justify-start pl-20">
            <ProjectCards />
        </div>
      </div>
    </div>
  );
}
