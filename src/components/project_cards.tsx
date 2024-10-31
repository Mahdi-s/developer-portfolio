import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import Link from "next/link";


export default function ProjectCards() {
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef(null);


    // Detect if the user is on a mobile device
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

  // Use useScroll with the gridRef to track the scroll within the grid container
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });
  

  // Conditionally use useScroll and useTransform only on desktop
  let translateYValues: MotionValue<number>[] = [];
  if (!isMobile) {
    // Use useScroll with the gridRef to track the scroll within the grid container
    const { scrollYProgress } = useScroll({
      container: gridRef,
      offset: ["start start", "end start"],
    });

    // Define motion values for each card to create the parallax effect
    translateYValues = [
      useTransform(scrollYProgress, [0, 1], [0, -100]),
      useTransform(scrollYProgress, [0, 1], [0, -80]),
      useTransform(scrollYProgress, [0, 1], [0, -60]),
      useTransform(scrollYProgress, [0, 1], [0, -40]),
      useTransform(scrollYProgress, [0, 1], [0, -20]),
      useTransform(scrollYProgress, [0, 1], [0, 0]),
      useTransform(scrollYProgress, [0, 1], [0, 20]),
      useTransform(scrollYProgress, [0, 1], [0, 40]),
      useTransform(scrollYProgress, [0, 1], [0, 60]),
      useTransform(scrollYProgress, [0, 1], [0, 80]),
    ];
  }

  return (
    <div ref={gridRef} className="w-full h-full overflow-y-auto scrollbar-hide">

      {/* Conditionally render motion.div or div based on isMobile */}
      {isMobile ? (
        <div className="w-full h-full">
          <div className="grid grid-cols-1 gap-2 p-1 w-full">

          <div
            className="w-full h-full"
          >
        <div className="grid grid-cols-1 gap-2 p-1 w-full">
          {/* Card 1 */}
          <div className="h-full">
            <CardContainer className="inter-var h-full pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Podlucination
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    An AI-generated podcast covering the latest interesting papers
                    in Artificial Intelligence research.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/podlucination.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Podlucination Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: NotebookLM, Python
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.youtube.com/@Podlucination"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Channel
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/podlucination"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 2 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    LLM Guts Visualizer
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    A tool to run queries on the DistilGPT2 model and visualize
                    the internal workings of the model.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/llmguts.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="LLM Guts Visualizer Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, PyTorch
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  {/* <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://llm-guts-visualizer.com"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem> */}

                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/llm.guts"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 3 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Federated Machine Learning on Segmenting Sensitive Medical Data
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Federated learning with U-Net for DFU segmentation achieves
                    0.9 dice score, preserving privacy effectively.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/fed_learning.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Federated Learning Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, PyTorch, Flower
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10507818"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Publication
                  </CardItem>

                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/federated-experiments"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 4 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulating Gerrymandering Impossiblity Theorem
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Exploring mathematical solutions to Gerrymandering Impossiblity Theorem.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/gerry.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Gerrymandering Study Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Flask, Heroku, Docker
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://gerrymandering-989f636aaf2b.herokuapp.com/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.youtube.com/watch?v=VqcE32C769I&t=1s"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Demo
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/election_research"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 5 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Gene Expression Analysis of Prostate Cancer vs Benign Prostate
                    Hyperplasia
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    RNA sequencing reveals diagnostic and treatment targets by
                    analyzing gene expression in prostate conditions.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/gene_study.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Gene Expression Study Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: R
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.medrxiv.org/content/10.1101/2022.12.21.22283808v1.full.pdf"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Pre-print
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/gene_analysis_prostate_cancer/tree/main"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 6 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulation-Based Synthetic Data Generation of Wireless Communication
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Simulating high-powered jamming on ADS-B signals to explore
                    machine learning detection methods using MATLAB.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/jamming.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Jamming Simulation Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, MATLAB
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/document/8833789"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Paper
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/High-powered-jamming-simulation"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.kaggle.com/datasets/mahdi13/signall"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Dataset
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 7 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Company SEC Filing Analyzer (Angur Analytics)
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Python app predicts NYSE stock prices using LSTM model based
                    on trading data and news.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/angur.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Angur Analytics Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Anvil
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://anguranalytics.webflow.io/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://angur-analytics-tool.anvil.app/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Demo
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/angur"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 8 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Mini Pascal to MIPS Assembly Translator
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Engine converts Pascal code with arithmetic and functions into
                    executable MIPS Assembly code.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/pascal.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Pascal Translator Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Pascal
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://drive.google.com/file/d/1fsDcubbnExg5KrOdlny1wHMiuiFkp2Gh/view"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Notes
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/mini-pascal-interpreter"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

          {/* Card 9 */}

          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulating Network of UAVs to Extract Communication Information
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Simulates drone networks using ns-3 to extract signal data
                    like SNR and drone specifics.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/uav.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="UAV Network Simulation Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: C++
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/document/9491882"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Paper
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/UAV-Network-Simulation"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>
          
          {/* Card 10 */}
          <div className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Tic Tac Toe Game - MIPS Assembly Implementation
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Bot plays tic-tac-toe using decision trees, prioritizing
                    blocking human player’s winning moves.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/tic-tac-toe.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Tic Tac Toe Game Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Assembly
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/TTT-game-Mips-Assembly"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>

        </div>
      </div>

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
          {/* Card 1 */}
          <motion.div style={{ y: translateYValues[0] }} className="h-full">
            <CardContainer className="inter-var h-full pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Podlucination
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    An AI-generated podcast covering the latest interesting papers
                    in Artificial Intelligence research.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/podlucination.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Podlucination Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: NotebookLM, Python
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.youtube.com/@Podlucination"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Channel
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/podlucination"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 2 */}
          <motion.div style={{ y: translateYValues[1] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    LLM Guts Visualizer
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    A tool to run queries on the DistilGPT2 model and visualize
                    the internal workings of the model.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/llmguts.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="LLM Guts Visualizer Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, PyTorch
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  {/* <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://llm-guts-visualizer.com"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem> */}

                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/llm.guts"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 3 */}
          <motion.div style={{ y: translateYValues[2] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Federated Machine Learning on Segmenting Sensitive Medical Data
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Federated learning with U-Net for DFU segmentation achieves
                    0.9 dice score, preserving privacy effectively.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/fed_learning.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Federated Learning Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, PyTorch, Flower
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10507818"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Publication
                  </CardItem>

                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/federated-experiments"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 4 */}
          <motion.div style={{ y: translateYValues[3] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulating Gerrymandering Impossiblity Theorem
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Exploring mathematical solutions to Gerrymandering Impossiblity Theorem.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/gerry.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Gerrymandering Study Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Flask, Heroku, Docker
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://gerrymandering-989f636aaf2b.herokuapp.com/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.youtube.com/watch?v=VqcE32C769I&t=1s"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Demo
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/election_research"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 5 */}
          <motion.div style={{ y: translateYValues[4] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Gene Expression Analysis of Prostate Cancer vs Benign Prostate
                    Hyperplasia
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    RNA sequencing reveals diagnostic and treatment targets by
                    analyzing gene expression in prostate conditions.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/gene_study.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Gene Expression Study Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: R
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.medrxiv.org/content/10.1101/2022.12.21.22283808v1.full.pdf"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Pre-print
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/gene_analysis_prostate_cancer/tree/main"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 6 */}
          <motion.div style={{ y: translateYValues[5] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulation-Based Synthetic Data Generation of Wireless Communication
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Simulating high-powered jamming on ADS-B signals to explore
                    machine learning detection methods using MATLAB.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/jamming.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Jamming Simulation Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, MATLAB
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/document/8833789"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Paper
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/High-powered-jamming-simulation"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://www.kaggle.com/datasets/mahdi13/signall"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Dataset
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 7 */}
          <motion.div style={{ y: translateYValues[6] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Company SEC Filing Analyzer (Angur Analytics)
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Python app predicts NYSE stock prices using LSTM model based
                    on trading data and news.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/angur.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Angur Analytics Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Anvil
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://anguranalytics.webflow.io/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    App
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://angur-analytics-tool.anvil.app/"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Demo
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/angur"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 8 */}
          <motion.div style={{ y: translateYValues[7] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Mini Pascal to MIPS Assembly Translator
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Engine converts Pascal code with arithmetic and functions into
                    executable MIPS Assembly code.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/pascal.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Pascal Translator Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Python, Pascal
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://drive.google.com/file/d/1fsDcubbnExg5KrOdlny1wHMiuiFkp2Gh/view"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Notes
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/mini-pascal-interpreter"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Card 9 */}

          <motion.div style={{ y: translateYValues[9] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Simulating Network of UAVs to Extract Communication Information
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Simulates drone networks using ns-3 to extract signal data
                    like SNR and drone specifics.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/uav.gif"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="UAV Network Simulation Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: C++
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://ieeexplore.ieee.org/document/9491882"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Paper
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/UAV-Network-Simulation"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>
          
          {/* Card 10 */}
          <motion.div style={{ y: translateYValues[8] }} className="h-full">
            <CardContainer className="inter-var pointer-events-auto">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
            {/* Add flex-1 to the content wrapper to ensure equal spacing */}
                <div className="flex-1">
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white mb-2"
                  >
                    Tic Tac Toe Game - MIPS Assembly Implementation
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-xs text-neutral-500 dark:text-neutral-300 line-clamp-3 mb-2"
                  >
                    Bot plays tic-tac-toe using decision trees, prioritizing
                    blocking human player’s winning moves.
                  </CardItem>
                  <CardItem
                    translateZ="100"
                    className="w-full h-84 relative mb-2"
                  >
                    <Image
                      src="/images/tic-tac-toe.png"
                      height="800"
                      width="800"
                      className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Tic Tac Toe Game Thumbnail"
                    />
                  </CardItem>
                  <CardItem
                    translateZ="50"
                    className="text-sm font-bold text-neutral-600 dark:text-white"
                  >
                    Tech Stack: Assembly
                  </CardItem>
                </div>
                {/* Keep buttons at the bottom */}
                <div className="flex justify-between items-center mt-4">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="https://github.com/Mahdi-s/TTT-game-Mips-Assembly"
                    target="__blank"
                    className="px-3 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Code
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

        </motion.div>
      </motion.div>
      )}
    </div>
  );
}
