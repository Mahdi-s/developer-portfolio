import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
} from "@tabler/icons-react";
import { FaMediumM, FaLinkedin, FaRobot } from "react-icons/fa";
import { FaGoogleScholar } from "react-icons/fa6";

export function Navbar() {
  const links = [
    {
      title: "Google Scholar",
      icon: (
        <FaGoogleScholar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://scholar.google.com/citations?user=yM8ClooAAAAJ&hl=en",
    },

    {
      title: "Blog",
      icon: (
        <FaMediumM className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://mahdisaeedi.medium.com/",
    },
    {
      title: "LinkedIn",
      icon: (
        <FaLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/mahdisaeedi/",
    },
    {
      title: "Podcast",
      icon: (
        <FaRobot className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.youtube.com/@Podlucination/videos",
    },
    // {
    //   title: "Twitter",
    //   icon: (
    //     <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   href: "https://x.com/Podlucination",
    // },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/Mahdi-s/",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[4rem] w-full relative z-30">
      <FloatingDock
        items={links}
      />
    </div>
  );
}
