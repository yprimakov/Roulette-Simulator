'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AnimatedBorder from './AnimatedBorder';

type ColorVariant = 'primary' | 'secondary' | 'sky' | 'blue' | 'purple' | 'green' | 'cyan' | 'teal' | 'lime' | 'red' | 'pink' | 'success' | 'error' | 'warning' | 'info';
type StyleVariant = 'solid' | 'outline' | 'link';
type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RoundedVariant = 'full' | 'lg' | 'md' | 'sm' | 'none';
type ShadowVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type DropdownDirection = 'down' | 'up' | 'left' | 'right';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

/**
 * Super Button Component
 * 
 * A comprehensive, highly customizable button component with extensive styling options.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click Me</Button>
 * 
 * // With all features
 * <Button
 *   color="purple"
 *   variant="solid"
 *   size="lg"
 *   rounded="lg"
 *   shadow="xl"
 *   animatedBorder
 *   animatedBorderVariant="rgb"
 *   loading={isLoading}
 *   onClick={handleClick}
 * >
 *   Submit
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Content to display inside the button */
  children: React.ReactNode;
  
  /** URL to navigate to (converts button to a link) */
  href?: string;
  
  /** Click event handler */
  onClick?: (e?: React.MouseEvent) => void;
  
  /** Visual style variant: solid (filled), outline (bordered), or link (text with underline animation) */
  variant?: StyleVariant;
  
  /** Color theme: primary (sky-500), secondary (gray), or any accent color */
  color?: ColorVariant;
  
  /** Button size from extra small to extra large */
  size?: SizeVariant;
  
  /** Border radius style */
  rounded?: RoundedVariant;
  
  /** Shadow intensity for depth effect */
  shadow?: ShadowVariant;
  
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset';
  
  /** Additional CSS classes to apply */
  className?: string;
  
  /** Inline styles to apply */
  style?: React.CSSProperties;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether to show loading spinner */
  loading?: boolean;
  
  /** Text to display when loading (optional) */
  loadingText?: string;
  
  /** Whether to wrap button with animated border effect */
  animatedBorder?: boolean;
  
  /** Type of animated border effect */
  animatedBorderVariant?: 'rgb' | 'trail' | 'gold' | 'hoverable';
  
  /** Whether animated border only appears on hover */
  animatedBorderHoverOnly?: boolean;
  
  /** Whether button should take full width of container */
  fullWidth?: boolean;
  
  /** Optional dropdown menu items */
  dropdownItems?: DropdownItem[];
  
  /** Direction the dropdown should open */
  dropdownDirection?: DropdownDirection;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  href, 
  onClick, 
  variant = 'solid',
  color = 'primary', 
  size = 'md',
  rounded = 'full',
  shadow = 'md',
  type = 'button',
  className = '',
  style,
  disabled = false,
  loading = false,
  loadingText,
  animatedBorder = false,
  animatedBorderVariant = 'rgb',
  animatedBorderHoverOnly = false,
  fullWidth = false,
  dropdownItems,
  dropdownDirection = 'down',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDisabled = disabled || loading || isLoading;
  const hasDropdown = dropdownItems && dropdownItems.length > 0;

  // Update dropdown position when it opens or on scroll/resize
  useEffect(() => {
    if (!isDropdownOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updatePosition();

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Base styles for all button types
  const baseStyles = variant !== 'link' 
    ? 'relative font-medium text-center transition-all ease-out duration-300 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-4 active:brightness-110 disabled:active:brightness-100 active:translate-y-0 active:duration-100 disabled:cursor-not-allowed disabled:opacity-50 [transition:all_300ms_ease-out,background_300ms_ease-out,transform_300ms_ease-out]'
    : 'font-semibold text-center transition-all duration-300 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-0 [transition:all_300ms_ease-out,background_300ms_ease-out]';

  // Size mappings
  const sizeClasses: Record<SizeVariant, string> = {
    xs: variant !== 'link' ? 'text-xs px-2.5 py-1.5' : 'text-xs',
    sm: variant !== 'link' ? 'text-sm px-3 py-2' : 'text-sm',
    md: variant !== 'link' ? 'text-base px-5 py-2.5' : 'text-base',
    lg: variant !== 'link' ? 'text-lg px-6 py-3' : 'text-lg',
    xl: variant !== 'link' ? 'text-xl px-8 py-4' : 'text-xl',
  };

  // Rounded mappings
  const roundedClasses: Record<RoundedVariant, string> = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-sm',
    none: 'rounded-none',
  };

  // Border radius values for AnimatedBorder
  const borderRadiusValues: Record<RoundedVariant, string> = {
    full: '9999px',
    lg: '0.5rem',   // 8px
    md: '0.375rem', // 6px
    sm: '0.125rem', // 2px
    none: '0',
  };

  // Shadow mappings (only for non-link variants)
  const shadowClasses: Record<ShadowVariant, string> = {
    none: '',
    sm: 'shadow-sm hover:shadow',
    md: 'shadow hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
    '2xl': 'shadow-2xl hover:shadow-2xl hover:brightness-110',
  };

  // Solid color mappings with gradients
  const solidColorMappings: Record<ColorVariant, string> = {
    primary: 'text-white bg-gradient-to-br from-sky-500 via-sky-400 to-sky-500 hover:from-sky-600 hover:via-sky-500 hover:to-sky-600 focus:ring-sky-300 dark:focus:ring-sky-800',
    secondary: 'text-gray-800 dark:text-gray-100 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 hover:from-gray-300 hover:via-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:via-gray-600 dark:hover:to-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600',
    sky: 'text-white bg-gradient-to-br from-sky-500 via-sky-400 to-sky-500 hover:from-sky-600 hover:via-sky-500 hover:to-sky-600 focus:ring-sky-300',
    blue: 'text-white bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 focus:ring-blue-300',
    purple: 'text-white bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 focus:ring-purple-300',
    green: 'text-white bg-gradient-to-br from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 focus:ring-green-300',
    cyan: 'text-white bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-700 hover:via-cyan-600 hover:to-cyan-700 focus:ring-cyan-300',
    teal: 'text-white bg-gradient-to-br from-teal-600 via-teal-500 to-teal-600 hover:from-teal-700 hover:via-teal-600 hover:to-teal-700 focus:ring-teal-300',
    lime: 'text-gray-900 bg-gradient-to-br from-lime-400 via-lime-300 to-lime-400 hover:from-lime-500 hover:via-lime-400 hover:to-lime-500 focus:ring-lime-300',
    red: 'text-white bg-gradient-to-br from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 focus:ring-red-300',
    pink: 'text-white bg-gradient-to-br from-pink-600 via-pink-500 to-pink-600 hover:from-pink-700 hover:via-pink-600 hover:to-pink-700 focus:ring-pink-300',
    success: 'text-white bg-gradient-to-br from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 focus:ring-green-300',
    error: 'text-white bg-gradient-to-br from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 focus:ring-red-300',
    warning: 'text-gray-900 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 focus:ring-yellow-300',
    info: 'text-white bg-gradient-to-br from-blue-500 via-blue-400 to-blue-500 hover:from-blue-600 hover:via-blue-500 hover:to-blue-600 focus:ring-blue-300',
  };

  // Outline color mappings
  const outlineColorMappings: Record<ColorVariant, string> = {
    primary: 'border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 focus:ring-sky-300',
    secondary: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 focus:ring-gray-300',
    sky: 'border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 focus:ring-sky-300',
    blue: 'border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:ring-blue-300',
    purple: 'border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 focus:ring-purple-300',
    green: 'border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 focus:ring-green-300',
    cyan: 'border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 focus:ring-cyan-300',
    teal: 'border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 focus:ring-teal-300',
    lime: 'border-2 border-lime-500 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-950/30 focus:ring-lime-300',
    red: 'border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:ring-red-300',
    pink: 'border-2 border-pink-500 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 focus:ring-pink-300',
    success: 'border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 focus:ring-green-300',
    error: 'border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:ring-red-300',
    warning: 'border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 focus:ring-yellow-300',
    info: 'border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:ring-blue-300',
  };

  // Link color mappings
  const linkColorMappings: Record<ColorVariant, string> = {
    primary: 'text-sky-600 dark:text-sky-400 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600',
    secondary: 'text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600',
    sky: 'text-sky-600 dark:text-sky-400 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600',
    blue: 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    purple: 'text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600',
    green: 'text-green-600 dark:text-green-400 bg-gradient-to-r from-green-400 via-green-500 to-green-600',
    cyan: 'text-cyan-600 dark:text-cyan-400 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600',
    teal: 'text-teal-600 dark:text-teal-400 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600',
    lime: 'text-lime-600 dark:text-lime-400 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600',
    red: 'text-red-600 dark:text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600',
    pink: 'text-pink-600 dark:text-pink-400 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600',
    success: 'text-green-600 dark:text-green-400 bg-gradient-to-r from-green-400 via-green-500 to-green-600',
    error: 'text-red-600 dark:text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600',
    warning: 'text-yellow-600 dark:text-yellow-400 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
    info: 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
  };

  // Get color classes based on variant
  const getColorClasses = () => {
    switch (variant) {
      case 'solid':
        return solidColorMappings[color];
      case 'outline':
        return outlineColorMappings[color];
      case 'link':
        return `${linkColorMappings[color]} bg-bottom bg-no-repeat bg-[length:0%_2px] hover:bg-[length:100%_2px] transition-all pb-[1px]`;
      default:
        return solidColorMappings[color];
    }
  };

  // Additional variant-specific styles (no hover translate if animated border is used)
  const variantStyles = variant !== 'link' 
    ? `${!animatedBorder ? 'hover:-translate-y-0.5' : ''} disabled:hover:translate-y-0 ${shadowClasses[shadow]}`
    : '';

  // Combine all classes
  const buttonClasses = [
    baseStyles,
    sizeClasses[size],
    variant !== 'link' ? roundedClasses[rounded] : '',
    getColorClasses(),
    variantStyles,
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  // Handle click with loading state and dropdown toggle
  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    // If has dropdown, toggle it
    if (hasDropdown) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }

    if (onClick) {
      onClick(e);
      if (loading) {
        setIsLoading(true);
        // Reset loading after 2 seconds (can be customized)
        setTimeout(() => setIsLoading(false), 2000);
      }
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="button-loading-spinner h-5 w-5"
      style={{
        animation: 'buttonSpinnerRotate 1s linear infinite',
      }}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      <style jsx>{`
        @keyframes buttonSpinnerRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );

  // Chevron icon for dropdown
  const ChevronIcon = () => (
    <svg 
      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Button content with optional loading state
  const buttonContent = (
    <>
      {(loading || isLoading) && (
        <LoadingSpinner />
      )}
      {(loading || isLoading) && loadingText ? loadingText : children}
      {hasDropdown && <ChevronIcon />}
    </>
  );

  // Render link variant
  if (variant === 'link') {
  if (href) {
      return (
        <Link 
          href={isDisabled ? '#' : href} 
          className={buttonClasses}
          style={style}
          onClick={handleClick}
        >
          {buttonContent}
        </Link>
      );
    }
    return (
      <a 
        className={buttonClasses}
        style={style}
        onClick={handleClick}
      >
        {buttonContent}
      </a>
    );
  }

  // Render button with optional animated border
  const buttonElement = href ? (
    <Link 
      href={isDisabled ? '#' : href}
      className={buttonClasses}
      style={style}
      onClick={handleClick}
    >
      {buttonContent}
    </Link>
  ) : (
    <button 
      type={type}
      onClick={handleClick}
      className={buttonClasses}
      style={style}
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  );

  // Calculate dropdown position styles based on direction
  const getDropdownPositionStyles = (): React.CSSProperties => {
    const gap = 8; // 8px gap from button
    const rect = buttonRef.current?.getBoundingClientRect();
    
    if (!rect) return {};

    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      minWidth: '12rem',
    };

    switch (dropdownDirection) {
      case 'up':
        return {
          ...baseStyles,
          bottom: window.innerHeight - rect.top + gap,
          left: rect.left,
        };
      case 'left':
        return {
          ...baseStyles,
          top: rect.top,
          right: window.innerWidth - rect.left + gap,
        };
      case 'right':
        return {
          ...baseStyles,
          top: rect.top,
          left: rect.right + gap,
        };
      case 'down':
      default:
        return {
          ...baseStyles,
          top: rect.bottom + gap,
          left: rect.left,
        };
    }
  };

  // Render dropdown menu using portal
  const renderDropdown = () => {
    if (!hasDropdown || !isDropdownOpen || typeof document === 'undefined') return null;

    const dropdownContent = (
      <div 
        ref={dropdownRef}
        style={getDropdownPositionStyles()}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {dropdownItems.map((item, index) => {
          if (item.divider) {
            return (
              <div 
                key={index} 
                className="border-t border-gray-200 dark:border-gray-700 my-1" 
              />
            );
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsDropdownOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2 text-left text-sm flex items-center gap-2
                ${item.disabled 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }
                transition-colors duration-150
              `}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );

    return createPortal(dropdownContent, document.body);
  };

  // Wrap button with AnimatedBorder if enabled
  let finalButton = buttonElement;
  
  if (animatedBorder) {
    finalButton = (
      <AnimatedBorder 
        variant={animatedBorderVariant}
        hoverOnly={animatedBorderHoverOnly}
        borderWidth={2}
        borderRadius={borderRadiusValues[rounded]}
        className="group"
      >
        {buttonElement}
      </AnimatedBorder>
    );
  }

  // Wrap in container if dropdown exists
  if (hasDropdown) {
    return (
      <>
        <div ref={buttonRef} className="relative inline-block">
          {finalButton}
        </div>
        {renderDropdown()}
      </>
    );
  }

  return finalButton;
};

export default Button;
