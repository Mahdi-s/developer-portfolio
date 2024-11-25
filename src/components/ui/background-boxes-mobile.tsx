"use client";
import React from "react";
import { cn } from "../../utils/cn";

export const BoxesMobileCore = ({
  className,
  ...rest
}: {
  className?: string;
}) => {
  // Define the number of rows and columns
  const rows = 20;
  const cols = 10;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        className
      )}
      {...rest}
    >
      <div className="w-full h-full grid grid-cols-10 grid-rows-20">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <div
            key={`box-${index}`}
            className="border border-black"
          />
        ))}
      </div>
    </div>
  );
};

export const BoxesMobile = React.memo(BoxesMobileCore);
