import { useMemo, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { mulberry32 } from '@/lib/random'

/* ------------------------------------------------------------------
   GoldParticles — tiny, soft, slow. Jewellery dust, not fireworks.
   Pure CSS keyframes (transform/opacity only) driven by per-particle
   custom properties, so a field of particles costs nothing to mount
   and never competes with page transitions for the main thread.
   Honours prefers-reduced-motion in the stylesheet.
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
  /** Static placement: position, size, peak opacity and drift direction. */
  style: CSSProperties
  /** Fixed-keyframe drift; only timing varies, so Chrome keeps it on the compositor. */
  motion: CSSProperties
  bright: boolean
}

export function GoldParticles({ count = 26, className, seed = 7, opacity = 0.7, size = [2, 5] }: GoldParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => {
      const left = rand() * 100
      const top = rand() * 100
      const px = size[0] + rand() * (size[1] - size[0])
      const delay = rand() * 8
      const duration = 10 + rand() * 12
      const driftX = (rand() - 0.5) * 50
      const driftY = -(18 + rand() * 46)
      const peak = opacity * (0.45 + rand() * 0.55)
      const bright = rand() > 0.7
      // The keyframes travel straight "up" by a fixed distance; rotating and
      // scaling the static wrapper turns that into each particle's own drift.
      const scale = Math.hypot(driftX, driftY) / 40
      const angle = (Math.atan2(driftX, -driftY) * 180) / Math.PI
      return {
        id: i,
        bright,
        style: {
          left: `${left}%`,
          top: `${top}%`,
          // wrapper is scaled to set the travel distance, so pre-divide the size
          width: px / scale,
          height: px / scale,
          opacity: peak,
          transform: `rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
        },
        motion: {
          animationDuration: `${duration.toFixed(2)}s`,
          // negative delay: the field is already alive when the page appears
          animationDelay: `${(-delay).toFixed(2)}s`,
        },
      }
    })
  }, [count, seed, opacity, size])

  return (
    <div aria-hidden data-particles className={cn('pointer-events-none absolute inset-0 overflow-clip', className)}>
      {particles.map((p) => (
        <span key={p.id} className="gold-particle" style={p.style}>
          <span className="gold-particle-dot" data-bright={p.bright || undefined} style={p.motion} />
        </span>
      ))}
    </div>
  )
}
