"use client";
import React, { useEffect, useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { BoxesMobile } from "@/components/ui/background-boxes-mobile";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function WelcomePage() {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

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

  // Loading state - extended for better logo reveal timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Increased to 2 seconds for better effect

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 20, duration: 0.8 },
    },
  };

  // Logo animation variants for graceful entrance
  const logoVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 200,
        duration: 1.2,
        ease: "easeOut"
      },
    },
  };

  // Render content based on client-side detection
  const renderContent = () => {
    if (!isClient) {
      return (
        <div className="h-screen w-full bg-lab-background flex items-center justify-center">
          <motion.div
            className="w-12 h-12 border-t-4 border-r-4 border-lab-highlight rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          ></motion.div>
        </div>
      );
    }

    return isMobile ? (
      <>
        {/* Mobile Background - Fixed to viewport */}
        <div className="fixed inset-0">
          <BoxesMobile className="pointer-events-auto" />
        </div>

        {/* Mobile Content */}
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center text-center px-6 pt-20 pointer-events-none">
            <motion.div
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={logoVariants}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="mb-8 pointer-events-none"
            >
              <Image
                src="/images/signals_lab_logo_big.png"
                alt="Signals Lab Logo"
                width={800}
                height={400}
                className="w-auto h-auto max-w-[600px] md:max-w-[800px] mx-auto"
                priority
              />
            </motion.div>

            <motion.p
              className="text-white text-lg md:text-xl font-mono max-w-2xl mb-8 pointer-events-none"
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Exploring the frontiers of signal processing, machine learning, and artificial intelligence.
            </motion.p>

            <motion.div
              className="flex flex-col md:flex-row gap-4 pointer-events-auto"
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <a
                href="/research"
                className="px-8 py-3 bg-lab-highlight text-lab-background font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 pointer-events-auto"
              >
                Explore Research
              </a>
              <a
                href="/team"
                className="px-8 py-3 border-2 border-lab-highlight text-lab-highlight font-semibold rounded-lg hover:bg-lab-highlight hover:text-lab-background transition-all duration-200 pointer-events-auto"
              >
                Meet the Team
              </a>
            </motion.div>
          </div>
        </div>
      </>
    ) : (
      <>
        {/* Desktop Background - Fixed to viewport */}
        <div className="fixed inset-0">
          <Boxes className="pointer-events-auto" />
          <div
            id="box-mask"
            className="absolute inset-0 w-full h-full bg-lab-background [mask-image:linear-gradient(to_top,white_2%,transparent)] pointer-events-none"
          />
        </div>

        {/* Desktop Content */}
        <div className="relative z-10 w-full min-h-screen flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center text-center px-6 pt-20 pointer-events-none">
            <motion.div
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={logoVariants}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="mb-8 pointer-events-none"
            >
              <Image
                src="/images/signals_lab_logo_big.png"
                alt="Signals Lab Logo"
                width={1000}
                height={500}
                className="w-auto h-auto max-w-[800px] md:max-w-[1000px] mx-auto"
                priority
              />
            </motion.div>

            <motion.p
              className="text-white text-lg md:text-xl font-mono max-w-2xl mb-8 pointer-events-none"
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Social Intelligence for generative, networked, adversarial, and large-scale systems.
            </motion.p>

            <motion.div
              className="flex flex-col md:flex-row gap-4 pointer-events-auto"
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={variants}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <a
                href="/research"
                className="px-8 py-3 bg-lab-highlight text-lab-background font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 pointer-events-auto"
              >
                Explore Research
              </a>
              <a
                href="/team"
                className="px-8 py-3 border-2 border-lab-highlight text-lab-highlight font-semibold rounded-lg hover:bg-lab-highlight hover:text-lab-background transition-all duration-200 pointer-events-auto"
              >
                Meet the Team
              </a>
            </motion.div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`relative w-full bg-lab-background ${
        isMobile ? "overflow-auto min-h-screen" : "h-screen overflow-hidden"
      }`}
    >
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-lab-background pointer-events-auto"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-12 h-12 border-t-4 border-r-4 border-lab-highlight rounded-full"
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
