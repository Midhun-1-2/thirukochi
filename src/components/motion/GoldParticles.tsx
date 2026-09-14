import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { mulberry32 } from '@/lib/random'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   GoldParticles — tiny, soft, slow. Jewellery dust, not fireworks.
   Uses transform/opacity only; honours prefers-reduced-motion.
------------------------------------------------------------------- */

interface GoldParticlesProps {
  count?: number
  className?: string
  /** Deterministic seed so layouts are stable between renders. */
  seed?: number
  /** Max opacity for the brightest particle. */
  opacity?: number
  /** Size range in px. */
  size?: [number, number]
}

interface Particle {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  driftX: number
  driftY: number
  peak: number
  bright: boolean
}

export function GoldParticles({ count = 26, className, seed = 7, opacity = 0.7, size = [2, 5] }: GoldParticlesProps) {
  const reduced = useReducedMotion()

  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: size[0] + rand() * (size[1] - size[0]),
      delay: rand() * 8,
      duration: 10 + rand() * 12,
      driftX: (rand() - 0.5) * 50,
      driftY: -(18 + rand() * 46),
      peak: opacity * (0.45 + rand() * 0.55),
      bright: rand() > 0.7,
    }))
  }, [count, seed, opacity, size])

  return (
    <div aria-hidden data-particles className={cn('pointer-events-none absolute inset-0 overflow-clip', className)}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.bright
              ? 'radial-gradient(circle, #fff8d6 0%, #f9df32 45%, rgba(249,223,50,0) 75%)'
              : 'radial-gradient(circle, #f9df32 0%, rgba(179,135,28,0.9) 40%, rgba(179,135,28,0) 75%)',
            opacity: reduced ? p.peak * 0.6 : 0,
            willChange: reduced ? undefined : 'transform, opacity',
          }}
          animate={
            reduced
              ? undefined
              : {
                  x: [0, p.driftX * 0.5, p.driftX],
                  y: [0, p.driftY * 0.5, p.driftY],
                  opacity: [0, p.peak, 0],
                  scale: [0.6, 1, 0.7],
                }
          }
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
