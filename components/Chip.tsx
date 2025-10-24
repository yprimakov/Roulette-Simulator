"use client";

import Image from "next/image";
import { ChipValue } from "@/types";
import AnimatedBorder from "./common/AnimatedBorder";

interface ChipProps {
  value: ChipValue | "clear" | "double" | "repeat";
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  tooltip?: string;
}

const CHIP_SIZES = {
  small: { width: 24, height: 24 },
  medium: { width: 64, height: 64 },
  large: { width: 80, height: 80 },
};

const CHIP_COLORS = {
  1: "bg-blue-600", // Blue
  5: "bg-red-600", // Red  
  10: "bg-yellow-400", // Yellow
  25: "bg-green-600", // Green
  100: "bg-gray-800", // Black
  clear: "bg-gray-200", // Light Gray/White
  double: "bg-orange-500", // Orange
  repeat: "bg-lime-400", // Lime Green
} as const;

export default function Chip({ 
  value, 
  size = "medium", 
  className = "", 
  onClick,
  selected = false,
  tooltip
}: ChipProps) {
  const chipSize = CHIP_SIZES[size];
  const chipColor = CHIP_COLORS[value];
  
  const chipContent = (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 group
        ${onClick ? "hover:scale-105" : ""}
        ${className}
      `}
      onClick={onClick}
      style={{ width: chipSize.width, height: chipSize.height }}
    >
      {/* Chip Base with Template Image */}
      <div className={`relative w-full h-full shadow-md
        hover:shadow-lg shadow-black/30 hover:shadow-black/20 
        transition-all duration-300 rounded-full ${chipColor}`}>
        {/* Template Image as Base */}
        <Image
          src="/img/chip-template.png"
          alt={`$${value} chip`}
          width={chipSize.width}
          height={chipSize.height}
          className=""
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {value === "clear" ? (
            <span className="text-blue-800 font-bold text-sm drop-shadow-md">Clear</span>
          ) : value === "double" ? (
            <span className="text-gray-700 font-bold text-sm drop-shadow-md">x2</span>
          ) : value === "repeat" ? (
            <svg className="w-4 h-4 text-gray-600 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          ) : (
            <span className="text-gray-700 font-bold text-sm drop-shadow-md">${value}</span>
          )}
        </div>
      </div>
      
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg z-30">
          <svg
            className="w-3 h-3 text-gray-900"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  // Wrap with AnimatedBorder if selected
  if (selected) {
    return (
      <AnimatedBorder
        borderWidth={0}
        variant="white"
        animationDuration={3}
        className="scale-110 transition-all duration-300 rounded-full"
      >
        {chipContent}
      </AnimatedBorder>
    );
  }

  return chipContent;
}
