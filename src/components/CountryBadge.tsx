/**
 * @file CountryBadge.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Badge component for displaying country flags
 */

import { getCountryCode } from '@/lib/flags';
import { cn } from '@/lib/utils';
import * as CountryFlags from 'country-flag-icons/react/3x2';

interface CountryBadgeProps {
  country?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCode?: boolean;
}

/**
 * Displays a country flag icon using proper SVG flags
 * Works reliably on all platforms
 *
 * @param country - The country name
 * @param size - Badge size (sm, md, lg)
 * @param showCode - Whether to show country code alongside flag
 * @param className - Additional CSS classes
 */
export function CountryBadge({
  country,
  size = 'md',
  showCode = false,
  className,
}: CountryBadgeProps) {
  const code = getCountryCode(country);
  if (!code) return null;

  // Get the flag component dynamically
  const FlagComponent = (CountryFlags as any)[code];
  if (!FlagComponent) return null;

  const sizeClasses = {
    sm: 'h-4 w-6',
    md: 'h-5 w-7',
    lg: 'h-8 w-12',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)} title={country}>
      <FlagComponent
        className={cn('rounded shadow-sm border border-muted/20', sizeClasses[size])}
      />
      {showCode && <span className="text-xs font-medium text-muted-foreground">{code}</span>}
    </div>
  );
}
