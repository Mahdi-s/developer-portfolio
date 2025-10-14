"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import { 
  IconFlask, 
  IconUsers, 
  IconArticle, 
  IconMail, 
  IconLogin,
  IconLogout
} from "@tabler/icons-react";

export function GlobalNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // Handle scroll logic for logo visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Show navbar logo after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAction = () => {
    if (isAdminPage) {
      // Sign out - redirect to home page
      window.location.href = '/';
    } else {
      // Go to admin
      window.location.href = '/admin';
    }
  };

  const navigationItems = [
    {
      title: "Research and Projects",
      icon: (
        <IconFlask className="h-full w-full text-lab-highlight" />
      ),
      href: "/research",
    },
    {
      title: "Meet the Team",
      icon: (
        <IconUsers className="h-full w-full text-lab-highlight" />
      ),
      href: "/team",
    },
    {
      title: "Articles",
      icon: (
        <IconArticle className="h-full w-full text-lab-highlight" />
      ),
      href: "/articles",
    },
    {
      title: "Reach Out",
      icon: (
        <IconMail className="h-full w-full text-lab-highlight" />
      ),
      href: "/contact",
    },
    {
      title: isAdminPage ? "Sign Out" : "Admin Login",
      icon: isAdminPage ? (
        <IconLogout className="h-full w-full text-red-400" />
      ) : (
        <IconLogin className="h-full w-full text-lab-highlight" />
      ),
      href: "#",
      onClick: handleAdminAction,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-auto">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Lab Logo */}
        <div className="flex items-center">
          <div 
            className={`transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center space-x-2">
              <IconFlask className="h-8 w-8 text-lab-highlight" />
              <span className="text-white font-bold text-lg">Signals Lab</span>
            </div>
          </div>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center">
          {/* Navigation Items */}
          <div className="hidden md:block">
            <FloatingDock
              items={navigationItems}
              desktopClassName="bg-transparent border-none"
            />
          </div>
          
          {/* Mobile Navigation - Show mobile dock */}
          <div className="md:hidden">
            <FloatingDock
              items={navigationItems}
              mobileClassName="bg-transparent"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
