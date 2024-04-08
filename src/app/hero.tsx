"use client";
import React, { useState } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { motion, useScroll } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import Image from "next/image";
import stickerImage from '@/../public/images/sticker.png'; // replace with your sticker image path
import { FaBlog, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";


//items-center justify-center
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

         <div className="flex-1 flex flex-col justify-center items-center text-center pl-40">
          
           <motion.h1
             className={cn("text-center text-5xl text-white relative z-20 pointer-events-none justify-center")}
             initial={{ x: 100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ duration: 1 }}
             style={{ wordWrap: 'break-word' }}
           >
             Mahdi Saeedi&apos;s Portfolio
           </motion.h1>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            >

            <div className="center-lines pointer-events-none">

           <motion.p
             className="text-center text-2xl text-neutral-300 relative z-20 pointer-events-none justify-center"
             initial={{ x: 100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ duration: 1, delay: 1.2 }}
             style={{ wordWrap: 'break-word' }}
           >
             Hi! Welcome to my corner of the internet. I like to create useful software, and study human interactions. This page showcases a sample of my work and interests. Feel free to reach out if you have any questions or just want to chat.
           </motion.p>

           </div>
          </motion.div>

          <br />

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.1}}
            className="pointer-events-auto z-0 md:z-50 pt-10"
            > 
              <TypewriterEffectSmooth words={words} />
          </motion.div>


          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="pointer-events-auto z-0 md:z-50"
            >
            <div className="pt-7 space-x-2">

              <a href="https://scholar.google.com/citations?user=yM8ClooAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="pointer-events-auto z-100"> 
                <button className="button inline-flex h-14 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6  font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 space-x-2 pointer-events-auto">
                  <span><SiGooglescholar /> </span>
                  <span>Publications</span>
                </button>
              </a>

              <a href="https://mahdisaeedi.medium.com/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto"> 
                <button className="button inline-flex h-14 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6  font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 space-x-2">
                  <span><FaBlog /> </span>
                  <span>Blog</span>
                </button>
              </a>

              <a href="https://www.linkedin.com/in/mahdisaeedi/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto"> 
                <button className="button inline-flex h-14 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6  font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 space-x-2">
                  <span><FaLinkedin /></span> 
                  <span>Linkedin</span>
                </button>
              </a>

              <a href="https://github.com/Mahdi-s" target="_blank" rel="noopener noreferrer" className="pointer-events-auto"> 
                <button className="button inline-flex h-14 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6  font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 space-x-2">
                  <span><FaGithub /> </span>
                  <span>Github</span>
                </button>
              </a>

            </div>
          </motion.div>

         </div>
                  
         <div className="flex-1 overflow-y-scroll right-side-div flex flex-col items-start justify-start pl-20">
        
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
                <motion.div
                  className="flex flex-col gap-0 p-4 space-y-5"
                  style={{ scaleX: scrollYProgress }}
                >
                  {/* Your boxes here */}

                  {/* <div style={{ height: '100px' }}></div> */}

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Federated Machine Learning on segmenting sensitive Medical Data
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                              This study explores using the U-Net model for Diabetic Foot Ulcers (DFUs) image segmentation within a 
                              federated learning framework, contrasting it with traditional centralized training. Leveraging an open-source
                               Medetec dataset for privacy-sensitive medical images, the research demonstrates that federated learning matches 
                               centralized methods in performance, achieving a dice score of 0.9 without the need for centralized data aggregation. 
                               This highlights federated learning&apos;s potential in medical image analysis while addressing privacy concerns. 
                               The research further contributes by providing a federated learning codebase, facilitating further 
                               exploration and development in the field.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/fed_learning.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Python, Pytorch, Flower
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://commons.und.edu/cgi/viewcontent.cgi?article=6672&context=theses"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Publication
                            </CardItem>

                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/federated-experiments"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Studying Mathematics of Partisan Gerrymandering
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                              Distrust with the electoral system in the United States has grown over the years. 
                              In this project, we&apos;ll explore some of the mathematics behind redistricting in order to find a solution 
                              for gerrymandering. I have prepared a more extensive discussion on the matter; please access it using the link below. 
                              I have also designed an online partisan gerrymandering calculator that lets us simulate an instance of state redistricting 
                              at various levels of resolution for party preference spread among the population. Please find a demo and link to the app below.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/gerry.gif"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Python, Anvil
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://pg-calculator.anvil.app/"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              App 
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://www.youtube.com/watch?v=VqcE32C769I&t=1s"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              App Demo
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://mahdisaeedi.medium.com/redistricting-courts-challenges-and-potential-solutions-1c38690e7ff"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Blog Post
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Gene Expression Analysis of Patients with Prostate Cancer vs Benign Prostate Hyperplasia
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                              This study analyzed the gene expression profiles of prostate cancer and benign prostate hyperplasia (BPH)
                              patients using RNA sequencing. It identified differentially expressed genes and analyzed their functions, 
                              suggesting potential diagnostic, prognostic, and treatment targets for both conditions.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/gene_study.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: R
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://www.medrxiv.org/content/10.1101/2022.12.21.22283808v1.full.pdf"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              View Pre-print
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Classifying wireless signals as healthy/jammed using Random Forest Decision Tree Algorithm
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >

                                  To identify jammed signals, we would need to ask series of questions about the signal data. 
                                  It turns out decision tree algorithms are great tools for accomplishing this type of classification. 
                                  In the project, I used python&apos;s scikit library&apos;s decision tree package to design a model that classifies healthy and jammed signals. 
                                  This was part of more extensive work to study machine learning capabilities in detecting jamming attacks which you can read about here. 
                                  I have included the code and additional notes on the decision tree algorithm which you can access below.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/decision_tree.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Python, scikit-learn, Numpy
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://mahdisaeedi.medium.com/classifying-jammed-signals-using-random-forest-decision-tree-algorithm-c4a45ea62760"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Notes
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/High-powered-jamming-simulation"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Simulating Wireless Communication to study effects of elementary high-powered jamming attacks
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >

                            This work explores jamming, particularly the impact of high-powered jammers on ADS-B signals, using MATLAB to simulate these effects. 
                            The dataset features 10 columns with signal information like energy and bad packet ratio. This research contributes to understanding 
                            how machine learning can detect jamming attacks. The simulation source code is available for use and further development into more complex 
                            jamming scenarios. For more details, my project notes are attached.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/jamming.gif"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Matlab
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://ieeexplore.ieee.org/document/8833789"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Published Work
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/High-powered-jamming-simulation"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://www.kaggle.com/datasets/mahdi13/signall"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Dataset
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Company SEC Filing Analyzer (Angur Analytics)
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                                Given the rise of retail investors, I&apos;ve been wondering if there are more effective ways of analyzing company data and making sense of the 
                                prospect of investment. My goal with Angur is to create a one-stop shop where users can analyze company data from financial statements, 
                                stock market data, and relative news. Angur is a python web application that allows users to access financial data and news data about a 
                                company traded on NYSE. Predict the next day&apos;s closing price of a particular stock using an LSTM neural network trained on trading data 
                                available on 30 previous days. I am extending this work to include different comparisons 
                                of the data points available, due to that, I have shut down the server. If you would like to test this application, please reach out to me.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/angur.gif"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Python, Anvil
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://anguranalytics.webflow.io/"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Landing Page 
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://angur-analytics-tool.anvil.app/"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              App Demo
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/angur"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Mini Pascal to MIPS Assembly translator - Python implementaion
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                          I created an engine that translates and reduces pascal code to executable MIPS Assembly code in this project. 
                          Pascal code can contain basic arithmetic, functions, variable assignment, etc.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/pascal.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Python, Pascal
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://drive.google.com/file/d/1fsDcubbnExg5KrOdlny1wHMiuiFkp2Gh/view"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Notes
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/mini-pascal-interpreter"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>

                          </div>
                        </CardBody>
                  </CardContainer>
                  

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                           Tic Tac Toe Game - MIPS Assembly implementation - Player vs Computer
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                          I designed a bot that plays a tic tac toe game with the user. At its heart, 
                          the algorithm utilizes a series of decision tree nodes at every move and prioritizes blocking possible winning moves of the human player.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/ttt_game.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: Assembly
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/TTT-game-Mips-Assembly"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>
                  
                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                          Air Traffic Managment GUI - C# implementation
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                          Mock user interface for an air traffic control unit. Shows airplane entering and exiting an air space and associated flight data monitors
                         plane movement for potential hazards. It warns the user in case of a possible crash, as shown in the image on the right. 
                         It also allows for modifying the background map.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/airtraffic_gui.png"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: C#
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/Mock-Flight-Management-System"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  <CardContainer className="inter-var z-0 md:z-50">
                        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6  border">
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                          Simulating network of UAVs to extract communication information
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                         This study employs the ns-3 library to simulate drone networks and ground station communication, 
                         extracting signal data like signal-to-noise ratio and drone specifics. The ns-3&apos;s object factory feature enables flexible
                          creation of various entities, including UAVs. The linked script is compatible with ns-3 version 3.21.
                          </CardItem>
                          <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                              src="/images/uav.gif"
                              height="1000"
                              width="1000"
                              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                              alt="thumbnail"
                            />
                          </CardItem>
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                          >
                            Tech Stack: C++
                          </CardItem>
                          <div className="flex justify-between items-center mt-10">
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://ieeexplore.ieee.org/document/9491882"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Published Work
                            </CardItem>
                            <CardItem
                              translateZ={20}
                              as={Link}
                              href="https://github.com/Mahdi-s/Mock-Flight-Management-System"
                              target="__blank"
                              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                              Source Code
                            </CardItem>
                          </div>
                        </CardBody>
                  </CardContainer>

                  {/* Add more boxes as needed */}
                </motion.div>

           </motion.div>
         </div>

      </div>
     </div>
     
    );
  }


