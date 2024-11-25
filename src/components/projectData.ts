// projectData.ts

export const projectData = [
  {
    title: "Data Lens",
    description:
      "Agentic Application that generates and executes sql queries (based on your prompt) on tabular data.",
    image: {
      src: "/images/datalens.gif",
      alt: "datalens Thumbnail",
    },
    techStack: "Python, Ollama",
    buttons: [
      {
        label: "Code",
        href: "https://github.com/Mahdi-s/DataLens",
      },
    ],
  },
  {
    title: "LLM Guts Visualizer",
    description:
      "A tool to run queries on the DistilGPT2 model and visualize the internal workings of the model.",
    image: {
      src: "/images/llmguts.gif",
      alt: "LLM Guts Visualizer Thumbnail",
    },
    techStack: "Python, PyTorch",
    buttons: [
      {
        label: "Code",
        href: "https://github.com/Mahdi-s/llm.guts",
      },
    ],
  },
  {
    title: "Federated Machine Learning on Segmenting Sensitive Medical Data",
    description:
      "Federated learning with U-Net for DFU segmentation achieves 0.9 dice score, preserving privacy effectively.",
    image: {
      src: "/images/fed_learning.jpg",
      alt: "Federated Learning Thumbnail",
    },
    techStack: "Python, PyTorch, Flower",
    buttons: [
      {
        label: "Publication",
        href: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10507818",
      },
      {
        label: "Code",
        href: "https://github.com/Mahdi-s/federated-experiments",
      },
    ],
  },
    {
      title: "Podlucination",
      description:
        "An AI-generated podcast covering the latest interesting papers in Artificial Intelligence research.",
      image: {
        src: "/images/podlucination.gif",
        alt: "Podlucination Thumbnail",
      },
      techStack: "NotebookLM, Python",
      buttons: [
        {
          label: "Channel",
          href: "https://www.youtube.com/@Podlucination/videos",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/podlucination",
        },
      ],
    },
    {
      title: "Simulating Gerrymandering Impossibility Theorem",
      description:
        "Exploring mathematical solutions to Gerrymandering Impossibility Theorem.",
      image: {
        src: "/images/gerry.gif",
        alt: "Gerrymandering Study Thumbnail",
      },
      techStack: "Python, Flask, Heroku, Docker",
      buttons: [
        {
          label: "App",
          href: "https://gerrymandering-989f636aaf2b.herokuapp.com/",
        },
        {
          label: "Demo",
          href: "https://www.youtube.com/watch?v=VqcE32C769I&t=1s",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/election_research",
        },
      ],
    },
    {
      title: "Gene Expression Analysis of Prostate Cancer vs Benign Prostate Hyperplasia",
      description:
        "Analyzed gene expression data to identify key factors in prostate cancer progression.",
      image: {
        src: "/images/gene_study.png",
        alt: "Gene Expression Study Thumbnail",
      },
      techStack: "R",
      buttons: [
        {
          label: "Pre-print",
          href: "https://www.medrxiv.org/content/10.1101/2022.12.21.22283808v1.full.pdf",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/gene_analysis_prostate_cancer/tree/main",
        },
      ],
    },
    {
      title: "Simulation-Based Synthetic Data Generation of Wireless Communication",
      description:
        "Simulating high-powered jamming on ADS-B signals to explore machine learning detection methods using MATLAB.",
      image: {
        src: "/images/jamming.gif",
        alt: "Jamming Simulation Thumbnail",
      },
      techStack: "Python, MATLAB",
      buttons: [
        {
          label: "Paper",
          href: "https://ieeexplore.ieee.org/document/8833789",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/High-powered-jamming-simulation",
        },
        {
          label: "Dataset",
          href: "https://www.kaggle.com/datasets/mahdi13/signall",
        },
      ],
    },
    // {
    //   title: "Company SEC Filing Analyzer (Angur Analytics)",
    //   description:
    //     "Python app predicts NYSE stock prices using LSTM model based on trading data and news.",
    //   image: {
    //     src: "/images/angur.gif",
    //     alt: "Angur Analytics Thumbnail",
    //   },
    //   techStack: "Python, Anvil",
    //   buttons: [
    //     {
    //       label: "App",
    //       href: "https://anguranalytics.webflow.io/",
    //     },
    //     {
    //       label: "Demo",
    //       href: "https://angur-analytics-tool.anvil.app/",
    //     },
    //     {
    //       label: "Code",
    //       href: "https://github.com/Mahdi-s/angur",
    //     },
    //   ],
    // },
    {
      title: "Mini Pascal to MIPS Assembly Translator",
      description:
        "Engine converts Pascal code with arithmetic and functions into executable MIPS Assembly code.",
      image: {
        src: "/images/pascal.png",
        alt: "Pascal Translator Thumbnail",
      },
      techStack: "Python, Pascal",
      buttons: [
        {
          label: "Notes",
          href: "https://drive.google.com/file/d/1fsDcubbnExg5KrOdlny1wHMiuiFkp2Gh/view",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/mini-pascal-interpreter",
        },
      ],
    },
    {
      title: "Simulating Network of UAVs to Extract Communication Information",
      description:
        "Simulates drone networks using ns-3 to extract signal data like SNR and drone specifics.",
      image: {
        src: "/images/uav.gif",
        alt: "UAV Network Simulation Thumbnail",
      },
      techStack: "C++",
      buttons: [
        {
          label: "Paper",
          href: "https://ieeexplore.ieee.org/document/9491882",
        },
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/UAV-Network-Simulation",
        },
      ],
    },
    {
      title: "Tic Tac Toe Game - MIPS Assembly Implementation",
      description:
        "Bot plays tic-tac-toe using decision trees, prioritizing blocking human player’s winning moves.",
      image: {
        src: "/images/tictactoe.jpeg",
        alt: "Tic Tac Toe Game Thumbnail",
      },
      techStack: "Assembly",
      buttons: [
        {
          label: "Code",
          href: "https://github.com/Mahdi-s/TTT-game-Mips-Assembly",
        },
      ],
    },
  ];
  