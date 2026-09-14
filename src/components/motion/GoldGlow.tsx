import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GoldGlowProps {
  className?: string
  /** 0–1 opacity of the glow. */
  intensity?: number
  size?: number
  drift?: boolean
}

/** Slowly drifting radial gold light — placed behind hero elements. */
export function GoldGlow({ className, intensity = 0.32, size = 520, drift = true }: GoldGlowProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      data-glow
      className={cn('pointer-events-none absolute rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(249,223,50,${intensity}) 0%, rgba(249,223,50,${intensity * 0.55}) 18%, rgba(179,135,28,${intensity * 0.3}) 38%, rgba(84,0,0,0) 66%)`,
        willChange: 'transform',
      }}
      animate={drift && !reduced ? { x: [0, 26, -12, 0], y: [0, -18, 14, 0] } : undefined}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
