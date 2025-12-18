/**
 * Button Component
 * Feature: 009-apple-hig-ui-redesign
 * Apple HIG-compliant button component with design system tokens
 */

'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { classNames } from '@/lib/design-system/classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: ReactNode;
  /** Visual variant following Apple HIG */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Whether to take full width of container */
  fullWidth?: boolean;
  /** Icon to display on the left */
  leftIcon?: ReactNode;
  /** Icon to display on the right */
  rightIcon?: ReactNode;
  /** Hide text when loading (show only spinner) */
  hideTextOnLoading?: boolean;
}

/**
 * Button Component
 *
 * Apple HIG-compliant button with design system tokens.
 * Supports multiple variants, sizes, loading states, and icons.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button loading disabled>
 *   Loading...
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button leftIcon={<Icon />} rightIcon={<Icon />}>
 *   With Icons
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    hideTextOnLoading = false,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  // Base styles using design tokens
  const baseStyles = classNames(
    'btn-base',
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:transform active:scale-95'
  );

  // Variant styles
  const variantStyles = {
    primary: classNames(
      'btn-primary',
      'bg-blue-600 text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'disabled:hover:bg-blue-600'
    ),
    secondary: classNames(
      'btn-secondary',
      'bg-gray-200 text-gray-900',
      'hover:bg-gray-300',
      'focus:ring-gray-500',
      'disabled:hover:bg-gray-200'
    ),
    tertiary: classNames(
      'btn-tertiary',
      'bg-transparent text-blue-600 border border-blue-600',
      'hover:bg-blue-50',
      'focus:ring-blue-500',
      'disabled:hover:bg-transparent'
    ),
    destructive: classNames(
      'btn-destructive',
      'bg-red-600 text-white',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'disabled:hover:bg-red-600'
    ),
    ghost: classNames(
      'btn-ghost',
      'bg-transparent text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'disabled:hover:bg-transparent'
    ),
  };

  // Size styles
  const sizeStyles = {
    sm: 'btn-sm px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'btn-md px-4 py-2 text-base rounded-lg min-h-[44px]',
    lg: 'btn-lg px-6 py-3 text-lg rounded-lg min-h-[52px]',
  };

  // Additional state styles
  const stateStyles = classNames(
    loading && 'btn-loading',
    isDisabled && 'btn-disabled',
    fullWidth && 'btn-full-width w-full'
  );

  const buttonClassName = classNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    stateStyles,
    className
  );

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner animate-spin" aria-hidden="true">
          <svg
            className="h-4 w-4"
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
          </svg>
        </span>
      )}
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      <span
        className="btn-content"
        style={{
          visibility: loading && hideTextOnLoading ? 'hidden' : 'visible',
        }}
      >
        {children}
      </span>
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
});
