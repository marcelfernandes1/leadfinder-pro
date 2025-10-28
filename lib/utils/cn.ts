/**
 * Class Name Utility
 *
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Based on shadcn/ui's cn utility.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names with Tailwind CSS conflict resolution
 *
 * @param inputs - Class names to merge
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
