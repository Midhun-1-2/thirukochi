import type { Transition, Variants } from 'framer-motion'

/** Signature easing — a fast start with a long, silky settle. */
export const luxuryEase = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 }
export const springGentle: Transition = { type: 'spring', stiffness: 160, damping: 22 }

export const durations = {
  fast: 0.22,
  base: 0.45,
  slow: 0.7,
} as const

/** Shared route transition. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.base, ease: luxuryEase } },
  exit: { opacity: 0, y: -10, transition: { duration: durations.fast, ease: 'easeIn' } },
}

export const fadeUp = (delay = 0, distance = 18): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxuryEase, delay } },
})

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay } },
})

export const scaleIn = (delay = 0, from = 0.95): Variants => ({
  hidden: { opacity: 0, scale: from },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: luxuryEase, delay } },
})

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: luxuryEase } },
}

export const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
}

export const hoverLift = { y: -3, transition: springSoft }
export const tapPress = { scale: 0.97 }
export const hoverScale = { scale: 1.02 }
