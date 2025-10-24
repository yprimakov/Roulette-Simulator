import React from "react";
import { SpotlightCard } from "@/components/common/Spotlight";
// import Spotlight from "@/components/Spotlight";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
  id?: string; // Make id optional
  onClick?: () => void;
  isHoverable?: boolean; // Default false
  hoverScale?: number; // Default 1.05 (5% scale)
  transitionDuration?: number; // Default 500ms
  customEasing?: string; // Custom easing function
  media?: React.ReactNode; // Optional media element (image, video, etc.)
  mediaClassName?: string; // Optional className for media wrapper
  mediaPosition?: 'top' | 'bottom'; // Position of media relative to content
  isActive?: boolean; // Default true - controls desaturation and opacity
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  outerClassName = "", 
  onClick,
  isHoverable = false,
  hoverScale = 1.05,
  transitionDuration = 500,
  customEasing,
  media,
  mediaClassName = "",
  mediaPosition = 'top',
  isActive = true
}) => {
  // Get duration class based on transitionDuration
  const getDurationClass = (duration: number) => {
    if (duration <= 100) return 'duration-100';
    if (duration <= 150) return 'duration-150';
    if (duration <= 200) return 'duration-200';
    if (duration <= 300) return 'duration-300';
    if (duration <= 500) return 'duration-500';
    if (duration <= 700) return 'duration-700';
    if (duration <= 1000) return 'duration-1000';
    return 'duration-300'; // fallback
  };

  // Get scale class based on hoverScale
  const getScaleClass = (scale: number) => {
    if (scale <= 1.01) return 'hover:scale-[1.01]';
    if (scale <= 1.02) return 'hover:scale-[1.02]';
    if (scale <= 1.03) return 'hover:scale-[1.03]';
    if (scale <= 1.04) return 'hover:scale-[1.04]';
    if (scale <= 1.05) return 'hover:scale-[1.05]';
    if (scale <= 1.06) return 'hover:scale-[1.06]';
    if (scale <= 1.07) return 'hover:scale-[1.07]';
    if (scale <= 1.08) return 'hover:scale-[1.08]';
    if (scale <= 1.09) return 'hover:scale-[1.09]';
    if (scale <= 1.1) return 'hover:scale-[1.1]';
    return 'hover:scale-[1.05]'; // fallback
  };

  // Build hover classes based on props
  const hoverClasses = isHoverable ? [
    'cursor-pointer',
    'transition-all',
    'hover:shadow-xl dark:shadow-white/10 shadow-black/10',
    'cursor-pointer group',
    getDurationClass(transitionDuration),
    getScaleClass(hoverScale),
    customEasing ? `ease-[${customEasing}]` : 'ease-[linear(0,-0.004_4.9%,-0.02ease-[cubic-bezier(0.33,1,0.68,1)]'
  ].join(' ') : '';

  // Build active/inactive classes
  const activeClasses = isActive 
    ? 'opacity-100' 
    : 'opacity-60 grayscale saturate-0 transition-all duration-300';

  // Combine all classes
  // If media is present, remove padding from the combined class and apply it only to content
  const combinedClassName = media 
    ? `rounded-3xl overflow-hidden ${className}`.trim()
    : `p-6 rounded-3xl ${className}`.trim();
  const combinedOuterClassName = `shadow-lg dark:shadow-2xl dark:shadow-sky-800/10 shadow-black/10 ${hoverClasses} ${activeClasses} ${outerClassName}`.trim();

  // Render media section if provided
  const renderMedia = () => {
    if (!media) return null;
    return (
      <div className={`w-full ${mediaClassName}`.trim()}>
        {media}
      </div>
    );
  };

  // Render content with padding when media is present
  const renderContent = () => {
    if (!media) return children;
    return <div className="p-6">{children}</div>;
  };

  return (
    <div className="relative h-full" onClick={onClick}>
      <SpotlightCard 
        className={combinedClassName} 
        outerClassName={combinedOuterClassName}
      >
        {mediaPosition === 'top' && renderMedia()}
        {renderContent()}
        {mediaPosition === 'bottom' && renderMedia()}
      </SpotlightCard>
    </div>
  );
};

export default Card;
