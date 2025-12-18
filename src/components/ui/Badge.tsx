/**
 * Badge Component
 * Feature: 009-apple-hig-ui-redesign
 * Apple HIG-compliant badge component with variants and sizes
 */

'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/lib/design-system/classNames';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outlined';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge text content */
  children: ReactNode;
  /** Badge variant for different styles */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Show dot indicator */
  dot?: boolean;
  /** Icon to display before text */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Badge Component
 *
 * Apple HIG-compliant badge for displaying status, counts, and labels.
 * Supports multiple variants, sizes, and optional dot indicators.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="lg" dot>
 *   3 New
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="outlined" icon={<Icon />}>
 *   Custom
 * </Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
  ...props
}: BadgeProps) {
  // Base styles
  const baseStyles = classNames(
    'badge-base',
    'inline-flex items-center gap-1',
    'rounded-full font-medium',
    'transition-colors duration-200'
  );

  // Variant styles
  const variantStyles = {
    default: 'badge-default bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'badge-primary bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'badge-success bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'badge-warning bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'badge-danger bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'badge-info bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    outlined:
      'badge-outlined bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'badge-sm px-2 py-0.5 text-xs',
    md: 'badge-md px-2.5 py-0.5 text-xs',
    lg: 'badge-lg px-3 py-1 text-sm',
  };

  const badgeClassName = classNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <span className={badgeClassName} {...props}>
      {dot && <span className="badge-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-content">{children}</span>
    </span>
  );
}
