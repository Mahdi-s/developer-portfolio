import { FaGithub, FaYoutube, FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

export const projectData = [
  {
    title: "Embedding and Clustering via subsampling and LLMs & NL2SQL",
    description:
      "Embedding and Heirarchical Clustering of text data via subsampling and LLMs & Natural Language to SQL Tool",
    image: "/images/embed.gif",
    techStack: ["Python", "Ollama"],
    links: [
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/Twitter_Embedding_Clustering_NL2SQL",
      },
    ],
  },
  {
    title: "LLMxIO Dashboard",
    description:
      "3D visualization of LLM Agentic Information Operation Simulations",
    image: "/images/llmxio.png",
    techStack: ["TypeScript", "React", "Three.js", "D3.js"],
    links: [
      {
        icon: <TbWorld className="h-4 w-4" />,
        url: "https://llmxio-dashboard.vercel.app/",
      },
    ],
  },
  {
    title: "Data Lens",
    description:
      "Agentic Application that generates and executes sql queries (based on your prompt) on tabular data.",
    image: "/images/datalens.gif",
    techStack: ["Python", "Ollama"],
    links: [
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/DataLens",
      },
    ],
  },
  {
    title: "LLM Guts Visualizer",
    description:
      "A tool to run queries on the DistilGPT2 model and visualize the internal workings of the model.",
    image: "/images/llmguts.gif",
    techStack: ["Python", "PyTorch"],
    links: [
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/llm.guts",
      },
    ],
  },
  {
    title: "Federated Machine Learning on Segmenting Sensitive Medical Data",
    description:
      "Federated learning with U-Net for DFU segmentation achieves 0.9 dice score, preserving privacy effectively.",
    image: "/images/fed_learning.jpg",
    techStack: ["Python", "PyTorch", "Flower"],
    links: [
      {
        icon: <FaFileAlt className="h-4 w-4" />,
        url: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10507818",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/federated-experiments",
      },
    ],
  },
  {
    title: "Podlucination",
    description:
      "An AI-generated podcast covering the latest interesting papers in Artificial Intelligence research.",
    image: "/images/podlucination.gif",
    techStack: ["NotebookLM", "Python"],
    links: [
      {
        icon: <FaYoutube className="h-4 w-4" />,
        url: "https://www.youtube.com/@Podlucination/videos",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/podlucination",
      },
    ],
  },
  {
    title: "Simulating Gerrymandering Impossibility Theorem",
    description:
      "Exploring mathematical solutions to Gerrymandering Impossibility Theorem.",
    image: "/images/gerry.gif",
    techStack: ["Python", "Flask", "Heroku", "Docker"],
    links: [
      {
        icon: <TbWorld className="h-4 w-4" />,
        url: "https://gerrymandering-989f636aaf2b.herokuapp.com/",
      },
      {
        icon: <FaYoutube className="h-4 w-4" />,
        url: "https://www.youtube.com/watch?v=VqcE32C769I&t=1s",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/election_research",
      },
    ],
  },
  {
    title: "Gene Expression Analysis of Prostate Cancer vs Benign Prostate Hyperplasia",
    description:
      "Analyzed gene expression data to identify key factors in prostate cancer progression.",
    image: "/images/gene_study.png",
    techStack: ["R"],
    links: [
      {
        icon: <FaFileAlt className="h-4 w-4" />,
        url: "https://www.medrxiv.org/content/10.1101/2022.12.21.22283808v1.full.pdf",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/gene_analysis_prostate_cancer/tree/main",
      },
    ],
  },
  {
    title: "Simulation-Based Synthetic Data Generation of Wireless Communication",
    description:
      "Simulating high-powered jamming on ADS-B signals to explore machine learning detection methods using MATLAB.",
    image: "/images/jamming.gif",
    techStack: ["Python", "MATLAB"],
    links: [
      {
        icon: <FaFileAlt className="h-4 w-4" />,
        url: "https://ieeexplore.ieee.org/document/8833789",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/High-powered-jamming-simulation",
      },
      {
        icon: <FaExternalLinkAlt className="h-4 w-4" />,
        url: "https://www.kaggle.com/datasets/mahdi13/signall",
      },
    ],
  },
  {
    title: "Mini Pascal to MIPS Assembly Translator",
    description:
      "Engine converts Pascal code with arithmetic and functions into executable MIPS Assembly code.",
    image: "/images/pascal.png",
    techStack: ["Python", "Pascal"],
    links: [
      {
        icon: <FaFileAlt className="h-4 w-4" />,
        url: "https://drive.google.com/file/d/1fsDcubbnExg5KrOdlny1wHMiuiFkp2Gh/view",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/mini-pascal-interpreter",
      },
    ],
  },
  {
    title: "Simulating Network of UAVs to Extract Communication Information",
    description:
      "Simulates drone networks using ns-3 to extract signal data like SNR and drone specifics.",
    image: "/images/uav.gif",
    techStack: ["C++"],
    links: [
      {
        icon: <FaFileAlt className="h-4 w-4" />,
        url: "https://ieeexplore.ieee.org/document/9491882",
      },
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/UAV-Network-Simulation",
      },
    ],
  },
  {
    title: "Tic Tac Toe Game - MIPS Assembly Implementation",
    description:
      "Bot plays tic-tac-toe using decision trees, prioritizing blocking human player’s winning moves.",
    image: "/images/tictactoe.gif",
    techStack: ["Assembly"],
    links: [
      {
        icon: <FaGithub className="h-4 w-4" />,
        url: "https://github.com/Mahdi-s/TTT-game-Mips-Assembly",
      },
    ],
  },
];