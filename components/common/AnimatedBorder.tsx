'use client';

import React from 'react';

interface AnimatedBorderProps {
  children?: React.ReactNode;
  variant?: 'rgb' | 'trail' | 'gold' | 'hoverable' | 'white';
  className?: string;
  borderWidth?: number;
  animationDuration?: number;
  hoverOnly?: boolean;
  borderRadius?: string;
}

const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  variant = 'rgb',
  className = '',
  borderWidth = 2,
  animationDuration = 3,
  hoverOnly = false,
  borderRadius = '9999px', // Default to rounded-full
}) => {
  return (
    <div
      className={`animated-border-container ${variant} ${hoverOnly ? 'hover-only' : ''} ${className}`}
      style={{
        ['--border-width' as string]: `${borderWidth}px`,
        ['--animation-duration' as string]: `${animationDuration}s`,
        ['--border-radius' as string]: borderRadius,
      }}
    >
      {children}

      <style jsx>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .animated-border-container {
          position: relative;
          border-radius: var(--border-radius);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }
        
        /* Match button hover/active animations */
        .animated-border-container:has(button:hover), 
        .animated-border-container:has(a:hover) {
          transform: translateY(-2px);
        }
        
        .animated-border-container:has(button:active), 
        .animated-border-container:has(a:active) {
          transform: translateY(0);
        }

        .animated-border-container::after,
        .animated-border-container::before {
          content: '';
          position: absolute;
          inset: calc(-1 * var(--border-width));
          z-index: -1;
          border-radius: var(--border-radius);
          animation: spin var(--animation-duration) linear infinite;
          background-size: cover;
          opacity: 0.8;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animated-border-container:hover::after,
        .animated-border-container:hover::before {
          opacity: 1;
        }

        /* RGB Variant - Full color spectrum */
        .animated-border-container.rgb::after,
        .animated-border-container.rgb::before {
          background-image: conic-gradient(
            from var(--angle),
            #ff4545,
            #00ff99,
            #006aff,
            #ff0095,
            #ff4545
          );
        }

        /* Trail Variant - Single color trail */
        .animated-border-container.trail::after,
        .animated-border-container.trail::before {
          background-image: conic-gradient(
            from var(--angle),
            transparent 80%,
            #ff4545
          );
        }

        /* Gold Variant - Repeating gold segments */
        .animated-border-container.gold::after,
        .animated-border-container.gold::before {
          background-image: repeating-conic-gradient(
            from var(--angle),
            rgba(255, 233, 191, 0) 0deg,
            rgba(255, 233, 191, 0) 45deg,
            rgba(213, 175, 0, 1) 90deg,
            rgba(255, 233, 191, 0) 135deg,
            rgba(255, 233, 191, 0) 180deg
          );
        }
        /* White Variant - White border */
        .animated-border-container.white::after,
        .animated-border-container.white::before {
          background-image: conic-gradient(
            from var(--angle),
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 1) 180deg,
            rgba(255, 255, 255, 0.5)
          );
        }

        /* Hoverable Variant - Only shows on hover */
        .animated-border-container.hoverable::after,
        .animated-border-container.hoverable::before {
          inset: 12px;
          opacity: 0;
        }

        .animated-border-container.hoverable:hover::after,
        .animated-border-container.hoverable:hover::before {
          background-image: conic-gradient(
            from var(--angle),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1) 180deg,
            rgba(255, 255, 255, 0)
          );
          inset: calc(-1 * var(--border-width));
          opacity: 1;
        }

        /* Blur effect on ::before for depth */
        .animated-border-container::before {
          filter: blur(1rem);
          opacity: 0.4;
        }

        .animated-border-container:hover::before {
          opacity: 0.6;
        }

        .animated-border-container.hoverable:hover::before {
          opacity: 0.4;
        }

        /* Hover-only mode */
        .animated-border-container.hover-only::after,
        .animated-border-container.hover-only::before {
          opacity: 0;
        }

        .animated-border-container.hover-only:hover::after,
        .animated-border-container.hover-only:hover::before {
          opacity: 1;
        }

        @keyframes spin {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBorder;

