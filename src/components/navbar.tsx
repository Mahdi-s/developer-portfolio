"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import { SiGooglescholar } from "react-icons/si";
import { FaBlog, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "flex-1 flex flex-col justify-center items-center text-center",
        className
      )}
    >
      <Menu setActive={setActive}>
        <HoveredLink
          href="https://scholar.google.com/citations?user=yM8ClooAAAAJ&hl=en"
          target="_blank"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SiGooglescholar /> Publications
          </div>
        </HoveredLink>

        <HoveredLink href="https://mahdisaeedi.medium.com/" target="_blank">
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaBlog />
            {"Blog "}
          </div>
        </HoveredLink>

        <HoveredLink
          href="https://www.linkedin.com/in/mahdisaeedi/"
          target="_blank"
        >
          <FaLinkedin /> Linkedin
        </HoveredLink>

        <HoveredLink href="https://github.com/Mahdi-s" target="_blank">
          <FaGithub /> Github
        </HoveredLink>
      </Menu>
    </div>
  );
}
