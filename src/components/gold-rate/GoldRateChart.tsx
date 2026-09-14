import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { luxuryEase } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   GoldRateChart — a restrained gold sparkline (not a trading chart).
   Smooth curve, gradient stroke, soft area fill, glowing end point.
------------------------------------------------------------------- */

interface GoldRateChartProps {
  points: number[]
  className?: string
  /** Re-run the draw animation when this changes (e.g. rate id). */
  animateKey?: string
}

const W = 240
const H = 72
const PAD = 6

function buildPath(points: number[]) {
  if (points.length < 2) return { line: '', area: '', last: { x: 0, y: 0 } }
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = (W - PAD * 2) / (points.length - 1)
  const coords = points.map((p, i) => ({
    x: PAD + i * step,
    y: PAD + (1 - (p - min) / range) * (H - PAD * 2),
  }))

  // Catmull-Rom → cubic bezier for a silky curve
  let d = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i]
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const p3 = coords[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  const last = coords[coords.length - 1]
  const area = `${d} L ${last.x} ${H} L ${coords[0].x} ${H} Z`
  return { line: d, area, last }
}

export function GoldRateChart({ points, className, animateKey }: GoldRateChartProps) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const { line, area, last } = useMemo(() => buildPath(points), [points])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full overflow-visible', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#91640F" />
          <stop offset="0.55" stopColor="#F9DF32" />
          <stop offset="1" stopColor="#FFF3B0" />
        </linearGradient>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9DF32" stopOpacity="0.28" />
          <stop offset="1" stopColor="#F9DF32" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        key={`area-${animateKey}`}
        d={area}
        fill={`url(#${id}-area)`}
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      />
      <motion.path
        key={`line-${animateKey}`}
        d={line}
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? undefined : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: luxuryEase }}
      />
      <motion.g
        key={`dot-${animateKey}`}
        initial={reduced ? undefined : { opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: luxuryEase }}
        style={{ transformOrigin: `${last.x}px ${last.y}px` }}
      >
        <circle cx={last.x} cy={last.y} r="7" fill="#F9DF32" opacity="0.18">
          {!reduced && <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" />}
        </circle>
        <circle cx={last.x} cy={last.y} r="2.6" fill="#FFF6C2" stroke="#F9DF32" strokeWidth="1" />
      </motion.g>
    </svg>
  )
}
