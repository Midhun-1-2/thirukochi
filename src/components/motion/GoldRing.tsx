import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   GoldRing — a large, slowly rotating jewellery-inspired ring motif
   used behind OTP / MPIN / Login content.
------------------------------------------------------------------- */

interface GoldRingProps {
  className?: string
  size?: number
  opacity?: number
}

export function GoldRing({ className, size = 640, opacity = 0.5 }: GoldRingProps) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', className)}
      style={{ width: size, height: size, opacity }}
    >
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F9DF32" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#B3871C" stopOpacity="0.25" />
            <stop offset="1" stopColor="#F9DF32" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#F9DF32" stopOpacity="0.16" />
            <stop offset="0.6" stopColor="#91640F" stopOpacity="0.06" />
            <stop offset="1" stopColor="#540000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="190" fill={`url(#${id}-glow)`} />

        {/* outer dashed orbit */}
        <motion.g
          style={{ originX: '200px', originY: '200px' }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="200" cy="200" r="178" fill="none" stroke={`url(#${id}-g)`} strokeWidth="0.8" strokeDasharray="2 10" />
          {[0, 90, 180, 270].map((a) => (
            <circle
              key={a}
              cx={200 + 178 * Math.cos((a * Math.PI) / 180)}
              cy={200 + 178 * Math.sin((a * Math.PI) / 180)}
              r="2.2"
              fill="#F9DF32"
            />
          ))}
        </motion.g>

        {/* mid solid ring */}
        <motion.g
          style={{ originX: '200px', originY: '200px' }}
          animate={reduced ? undefined : { rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="200" cy="200" r="146" fill="none" stroke={`url(#${id}-g)`} strokeWidth="1.2" />
          <circle cx="200" cy="200" r="146" fill="none" stroke="#F9DF32" strokeWidth="1.2" strokeDasharray="60 860" strokeLinecap="round" opacity="0.9" />
        </motion.g>

        {/* inner facet ring */}
        <circle cx="200" cy="200" r="112" fill="none" stroke={`url(#${id}-g)`} strokeWidth="0.6" opacity="0.7" />
        <g fill="none" stroke="#F9DF32" strokeWidth="0.5" opacity="0.35">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 * Math.PI) / 180
            return (
              <line
                key={i}
                x1={200 + 106 * Math.cos(a)}
                y1={200 + 106 * Math.sin(a)}
                x2={200 + 112 * Math.cos(a)}
                y2={200 + 112 * Math.sin(a)}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
