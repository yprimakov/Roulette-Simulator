'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'solid' | 'outline';
export type ToggleColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'brand';

export interface ToggleButtonProps {
  /** Current state of the toggle */
  checked: boolean;
  /** Callback when toggle state changes */
  onChange: (checked: boolean) => void;
  /** Label text displayed next to the toggle */
  label?: string;
  /** Description text below the label */
  description?: string;
  /** Size of the toggle */
  size?: ToggleSize;
  /** Visual variant */
  variant?: ToggleVariant;
  /** Color theme */
  color?: ToggleColor;
  /** Show checkmark icon when checked */
  showIcon?: boolean;
  /** Custom icon for checked state */
  checkedIcon?: React.ReactNode;
  /** Custom icon for unchecked state */
  uncheckedIcon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** ID for the input element */
  id?: string;
  /** Name for the input element */
  name?: string;
}

const sizeConfig = {
  sm: {
    track: 'w-9 h-5',
    knob: 'w-4 h-4',
    icon: 'w-2.5 h-2.5',
    text: 'text-sm',
    label: 'text-sm',
    description: 'text-xs',
  },
  md: {
    track: 'w-11 h-6',
    knob: 'w-5 h-5',
    icon: 'w-3 h-3',
    text: 'text-sm',
    label: 'text-base',
    description: 'text-sm',
  },
  lg: {
    track: 'w-14 h-7',
    knob: 'w-6 h-6',
    icon: 'w-3.5 h-3.5',
    text: 'text-base',
    label: 'text-lg',
    description: 'text-base',
  },
};

const colorConfig = {
  primary: {
    solid: {
      checked: 'bg-red-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-red-500 border-2 border-red-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
  success: {
    solid: {
      checked: 'bg-teal-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-teal-500 border-2 border-teal-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
  warning: {
    solid: {
      checked: 'bg-yellow-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-yellow-500 border-2 border-yellow-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
  danger: {
    solid: {
      checked: 'bg-red-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-red-500 border-2 border-red-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
  info: {
    solid: {
      checked: 'bg-purple-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-purple-500 border-2 border-purple-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
  dark: {
    solid: {
      checked: 'bg-gray-900 dark:bg-gray-100',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-gray-900 dark:bg-gray-100 border-2 border-gray-900 dark:border-gray-100',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white dark:bg-gray-900',
    icon: 'text-white dark:text-gray-900',
  },
  brand: {
    solid: {
      checked: 'bg-blue-500',
      unchecked: 'bg-gray-200 dark:bg-gray-700',
    },
    outline: {
      checked: 'bg-blue-500 border-2 border-blue-500',
      unchecked: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    },
    knob: 'bg-white',
    icon: 'text-white',
  },
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  variant = 'solid',
  color = 'primary',
  showIcon = false,
  checkedIcon,
  uncheckedIcon,
  disabled = false,
  className,
  style,
  id,
  name,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const config = sizeConfig[size];
  const colors = colorConfig[color];
  
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Generate unique ID for accessibility
  const inputId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const trackClasses = cn(
    'relative inline-flex items-center rounded-full transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'focus:ring-blue-500 dark:focus:ring-blue-400',
    config.track,
    checked ? colors[variant].checked : colors[variant].unchecked,
    disabled && 'opacity-50 cursor-not-allowed',
    isPressed && 'scale-95',
    className
  );

  const knobClasses = cn(
    'absolute rounded-full transition-all duration-200 ease-in-out',
    'flex items-center justify-center',
    'shadow-sm',
    config.knob,
    colors.knob,
    // Proper positioning - start from left edge with small margin
    'left-0.5',
    // Move to right edge when checked with proper offset
    checked ? (size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-7') : 'translate-x-0'
  );

  const iconClasses = cn(
    'transition-opacity duration-200',
    config.icon,
    colors.icon,
    checked ? 'opacity-100' : 'opacity-0'
  );

  return (
    <div className="flex items-center gap-3">
      {/* Toggle Switch */}
      <button
        type="button"
        className={trackClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${inputId}-label` : undefined}
        tabIndex={disabled ? -1 : 0}
        style={style}
      >
        {/* Hidden input for form compatibility */}
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          onChange={() => {}} // Handled by button click
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
        />
        
        {/* Knob */}
        <div className={knobClasses}>
          {/* Custom icons */}
          {checkedIcon && checked && (
            <div className={cn('transition-opacity duration-200', config.icon, colors.icon, 'opacity-100')}>
              {checkedIcon}
            </div>
          )}
          {uncheckedIcon && !checked && (
            <div className={cn('transition-opacity duration-200', config.icon, colors.icon, 'opacity-100')}>
              {uncheckedIcon}
            </div>
          )}
          {/* Default checkmark icon */}
          {showIcon && !checkedIcon && !uncheckedIcon && (
            <Check className={iconClasses} />
          )}
        </div>
      </button>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              id={`${inputId}-label`}
              htmlFor={inputId}
              className={cn(
                'font-medium text-gray-900 dark:text-white cursor-pointer',
                config.label,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span className={cn(
              'text-gray-500 dark:text-gray-400',
              config.description,
              disabled && 'opacity-50'
            )}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleButton;