import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   GoldRibbon — the signature motif: a flowing band of liquid gold.
   Built from SVG paths with layered gradients, blur and a slow
   drift. Kept at low opacity so content stays readable.
------------------------------------------------------------------- */

interface GoldRibbonProps {
  className?: string
  /** Mirror horizontally. */
  flip?: boolean
  opacity?: number
  /** Which side of the container the ribbon hugs. */
  variant?: 'sweep' | 'arc' | 'wave'
  /** Play the entrance draw animation. */
  draw?: boolean
  /** Soften the container edges so the band never ends in a hard cut. */
  fade?: 'right' | 'left' | 'x' | 'top' | 'x-top' | 'none'
}

const fadeMasks: Record<NonNullable<GoldRibbonProps['fade']>, string | undefined> = {
  none: undefined,
  right: 'linear-gradient(90deg, #000 55%, transparent 100%)',
  left: 'linear-gradient(90deg, transparent 0%, #000 45%)',
  x: 'linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)',
  // the band's top edge dissolves into the page instead of ending in a straight line
  top: 'linear-gradient(180deg, transparent 0%, #000 45%)',
  'x-top': 'linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 45%)',
}

const shapes = {
  sweep: {
    band: 'M-80 300 C 180 120, 420 420, 700 240 S 1120 80, 1320 200 L 1320 280 C 1120 170, 900 320, 700 330 S 220 260, -80 380 Z',
    line: 'M-80 340 C 200 150, 440 450, 720 280 S 1120 120, 1320 240',
    thin: 'M-80 250 C 160 90, 380 380, 660 200 S 1080 40, 1320 150',
  },
  arc: {
    band: 'M-60 420 C 200 20, 560 -40, 860 140 S 1240 380, 1320 120 L 1320 200 C 1220 420, 940 300, 800 220 S 260 120, -60 500 Z',
    line: 'M-60 460 C 220 60, 580 0, 880 180 S 1240 420, 1320 160',
    thin: 'M-60 380 C 180 -10, 540 -60, 840 100 S 1220 340, 1320 90',
  },
  wave: {
    band: 'M-80 220 C 120 120, 260 320, 460 220 S 800 120, 1000 220 S 1240 320, 1320 220 L 1320 260 C 1240 360, 1000 260, 800 260 S 460 360, 260 260 S 20 160, -80 260 Z',
    line: 'M-80 250 C 120 150, 260 350, 460 250 S 800 150, 1000 250 S 1240 350, 1320 250',
    thin: 'M-80 180 C 120 80, 260 280, 460 180 S 800 80, 1000 180 S 1240 280, 1320 180',
  },
}

export function GoldRibbon({ className, flip, opacity = 0.75, variant = 'sweep', draw = true, fade = 'none' }: GoldRibbonProps) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const entrance = useEntrance()
  const drawIn = draw && !reduced && entrance
  const s = shapes[variant]

  return (
    <div
      aria-hidden
      data-ribbon
      className={cn('pointer-events-none absolute inset-0 overflow-clip', className)}
      style={{
        opacity,
        transform: flip ? 'scaleX(-1)' : undefined,
        WebkitMaskImage: fadeMasks[fade],
        maskImage: fadeMasks[fade],
        // two masks (x + top) must both apply
        WebkitMaskComposite: fade === 'x-top' ? 'source-in' : undefined,
        maskComposite: fade === 'x-top' ? 'intersect' : undefined,
      }}
    >
      {/* drift is a compositor-only CSS animation: the blurred band is rasterised once */}
      <svg
        viewBox="0 0 1240 480"
        preserveAspectRatio="xMidYMid slice"
        className="animate-ribbon-drift absolute inset-0 h-full w-full will-change-transform"
      >
        <defs>
          <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#91640F" stopOpacity="0" />
            <stop offset="0.18" stopColor="#B3871C" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#F9DF32" stopOpacity="0.85" />
            <stop offset="0.62" stopColor="#FFF3B0" stopOpacity="0.9" />
            <stop offset="0.8" stopColor="#B3871C" stopOpacity="0.55" />
            <stop offset="1" stopColor="#91640F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F9DF32" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFF6C8" stopOpacity="1" />
            <stop offset="1" stopColor="#F9DF32" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-blur`} x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id={`${id}-soft`} x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* soft under-glow */}
        <path d={s.band} fill={`url(#${id}-band)`} filter={`url(#${id}-blur)`} opacity="0.6" />

        {/* main metallic band */}
        <motion.path
          d={s.band}
          fill={`url(#${id}-band)`}
          initial={drawIn ? { opacity: 0 } : false}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
        />

        {/* bright highlight line */}
        <motion.path
          d={s.line}
          fill="none"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          filter={`url(#${id}-soft)`}
          initial={drawIn ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        />

        {/* thin trailing thread */}
        <motion.path
          d={s.thin}
          fill="none"
          stroke={`url(#${id}-line)`}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.55"
          initial={drawIn ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        />
      </svg>
    </div>
  )
}
