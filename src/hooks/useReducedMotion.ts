import { useContext } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { AccessibilityContext } from '../context/AccessibilityContext';

/**
 * Returns true if animations should be reduced.
 * Merges two sources: the user's toolbar preference and the OS-level
 * prefers-reduced-motion media query (via Framer Motion's hook).
 */
export function useReducedMotion(): boolean {
  const { reducedMotion } = useContext(AccessibilityContext);
  const osReducedMotion = useFramerReducedMotion();
  return reducedMotion || osReducedMotion || false;
}
