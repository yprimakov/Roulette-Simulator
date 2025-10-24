'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CardNeonProps {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
  id?: string;
  onClick?: () => void;
  isHoverable?: boolean;
  hoverScale?: number;
  transitionDuration?: number;
  media?: React.ReactNode;
  mediaClassName?: string;
  mediaPosition?: 'top' | 'bottom';
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'green' | 'pink' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  isActive?: boolean; // Default true - controls desaturation and opacity
}

const CardNeon: React.FC<CardNeonProps> = ({
  children,
  className = "",
  outerClassName = "",
  onClick,
  isHoverable = false,
  hoverScale = 1.05,
  transitionDuration = 500,
  media,
  mediaClassName = "",
  mediaPosition = 'top',
  glowColor = 'cyan',
  intensity = 'medium',
  animated = true,
  theme = 'auto',
  isActive = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  // Color configurations
  const glowColors = {
    cyan: {
      primary: 'rgb(0, 255, 255)',
      secondary: 'rgb(0, 200, 255)',
      gradient: 'from-cyan-400 via-blue-500 to-cyan-400',
      shadow: 'shadow-cyan-500/50',
      border: 'border-cyan-500/30',
      glow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)'
    },
    magenta: {
      primary: 'rgb(255, 0, 255)',
      secondary: 'rgb(255, 0, 200)',
      gradient: 'from-magenta-400 via-pink-500 to-magenta-400',
      shadow: 'shadow-magenta-500/50',
      border: 'border-magenta-500/30',
      glow: '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)'
    },
    purple: {
      primary: 'rgb(168, 85, 247)',
      secondary: 'rgb(147, 51, 234)',
      gradient: 'from-purple-400 via-violet-500 to-purple-400',
      shadow: 'shadow-purple-500/50',
      border: 'border-purple-500/30',
      glow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)'
    },
    green: {
      primary: 'rgb(34, 197, 94)',
      secondary: 'rgb(22, 163, 74)',
      gradient: 'from-green-400 via-emerald-500 to-green-400',
      shadow: 'shadow-green-500/50',
      border: 'border-green-500/30',
      glow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.2)'
    },
    pink: {
      primary: 'rgb(236, 72, 153)',
      secondary: 'rgb(219, 39, 119)',
      gradient: 'from-pink-400 via-rose-500 to-pink-400',
      shadow: 'shadow-pink-500/50',
      border: 'border-pink-500/30',
      glow: '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)'
    },
    orange: {
      primary: 'rgb(251, 146, 60)',
      secondary: 'rgb(249, 115, 22)',
      gradient: 'from-orange-400 via-red-500 to-orange-400',
      shadow: 'shadow-orange-500/50',
      border: 'border-orange-500/30',
      glow: '0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(251, 146, 60, 0.3), 0 0 60px rgba(251, 146, 60, 0.2)'
    }
  };

  const currentColor = glowColors[glowColor];

  // Intensity multipliers
  const intensityMap = {
    low: 0.5,
    medium: 1,
    high: 1.5
  };

  const intensityMultiplier = intensityMap[intensity];

  // Get duration class
  const getDurationClass = (duration: number) => {
    if (duration <= 100) return 'duration-100';
    if (duration <= 150) return 'duration-150';
    if (duration <= 200) return 'duration-200';
    if (duration <= 300) return 'duration-300';
    if (duration <= 500) return 'duration-500';
    if (duration <= 700) return 'duration-700';
    if (duration <= 1000) return 'duration-1000';
    return 'duration-300';
  };

  // Build active/inactive classes
  const activeClasses = isActive 
    ? 'opacity-100' 
    : 'opacity-60 grayscale saturate-0 transition-all duration-300';

  // Build hover classes
  const hoverClasses = isHoverable ? [
    'cursor-pointer',
    'transition-all',
    getDurationClass(transitionDuration),
  ].join(' ') : '';

  const scaleStyle = isHoverable && isHovered ? { transform: `scale(${hoverScale})` } : {};

  // Combine classes
  const combinedClassName = media
    ? `rounded-3xl overflow-hidden ${className}`.trim()
    : `p-6 rounded-3xl ${className}`.trim();

  // Render media section
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

  // Get background class based on theme
  const getBackgroundClass = () => {
    if (theme === 'light') {
      return 'bg-white/95';
    } else if (theme === 'dark') {
      return 'bg-slate-900/95';
    } else {
      // auto - responds to system theme
      return 'bg-white/95 dark:bg-slate-900/95';
    }
  };

  return (
    <div 
      className={`relative h-full ${activeClasses} ${outerClassName}`} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border */}
      <div
        ref={cardRef}
        className={`
          relative p-[2px] rounded-3xl h-full
          bg-gradient-to-r ${currentColor.gradient}
          ${animated ? 'animate-gradient-xy' : ''}
          ${hoverClasses}
        `}
        style={{
          ...scaleStyle,
          boxShadow: isHovered 
            ? currentColor.glow.split(',').map(s => s.trim()).map(s => 
                s.replace(/[\d.]+(?=\))/g, (match) => String(parseFloat(match) * intensityMultiplier))
              ).join(', ')
            : 'none',
          transition: `all ${transitionDuration}ms ease-out`
        }}
      >
        {/* Glass morphism background with backdrop blur */}
        <div 
          className={`
            relative h-full
            ${getBackgroundClass()}
            backdrop-blur-xl
            ${combinedClassName}
          `}
        >
          {/* Radial gradient overlay following mouse */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none opacity-30 rounded-3xl"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${currentColor.primary}, transparent 40%)`,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10">
            {mediaPosition === 'top' && renderMedia()}
            {renderContent()}
            {mediaPosition === 'bottom' && renderMedia()}
          </div>

          {/* Inner glow effect */}
          <div 
            className={`
              absolute inset-0 rounded-3xl pointer-events-none
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            `}
            style={{
              boxShadow: `inset 0 0 20px ${currentColor.primary}20, inset 0 0 40px ${currentColor.primary}10`
            }}
          />
        </div>
      </div>

      {/* Global styles for gradient animation */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default CardNeon;

