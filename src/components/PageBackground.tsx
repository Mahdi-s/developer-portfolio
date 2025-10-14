'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Boxes } from './ui/background-boxes'
import { BoxesMobile } from './ui/background-boxes-mobile'

interface PageBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function PageBackground({ children, className = '' }: PageBackgroundProps) {
  const [isMobile, setIsMobile] = useState(true) // Default to mobile
  const [isClient, setIsClient] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Early mobile detection
  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intercept scroll events anywhere on the page and apply to content container
  useEffect(() => {
    if (!isClient) return

    const handleWheel = (e: WheelEvent) => {
      // Only prevent default and handle scrolling if we have a scroll container
      if (scrollContainerRef.current) {
        // Check if the event target is within the scrollable content
        // This allows normal scrolling within the content area
        const isWithinContent = scrollContainerRef.current.contains(e.target as Node)
        
        // If scrolling over the background or anywhere else, redirect to content
        if (!isWithinContent) {
          e.preventDefault()
          scrollContainerRef.current.scrollBy({
            top: e.deltaY,
            left: e.deltaX,
            behavior: 'auto'
          })
        }
      }
    }

    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className={`relative w-full h-screen bg-lab-background overflow-hidden ${className}`}>
        <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-screen bg-lab-background overflow-hidden ${className}`}>
      {isMobile ? (
        <>
          {/* Mobile Background - Fixed to viewport */}
          <div className="fixed inset-0">
            <BoxesMobile className="pointer-events-auto" />
          </div>

          {/* Mobile Content - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="relative z-10 w-full h-full overflow-y-auto pointer-events-none"
          >
            {children}
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

          {/* Desktop Content - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="relative z-10 w-full h-full overflow-y-auto pointer-events-none"
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}
