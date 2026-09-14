import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/** Boolean wrapper around Framer's hook (which may return null before hydration). */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}
