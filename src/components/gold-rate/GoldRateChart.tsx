import { useId, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   GoldRateChart — a restrained gold sparkline (not a trading chart).
   Smooth curve, gradient stroke, soft area fill, glowing end point.
   Draws itself in on every showing with CSS keyframes (compositor
   friendly; nothing runs on the main thread per frame).
------------------------------------------------------------------- */

interface GoldRateChartProps {
  points: number[]
  className?: string
  /** Re-run the draw animation when this changes (e.g. rate id). */
  animateKey?: string
  /** Play the draw-in on mount. */
  draw?: boolean
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

export function GoldRateChart({ points, className, animateKey, draw = true }: GoldRateChartProps) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const still = reduced || !draw
  const { line, area, last } = useMemo(() => buildPath(points), [points])

  return (
    <div className={cn('relative h-full w-full', className)} aria-hidden>
      {/* The draw-in is pure CSS (see chart-* utilities): no per-frame script, and the
          SVG sits on its own layer so the repaints stay confined to the sparkline. */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible will-change-transform">
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

        <path key={`area-${animateKey}`} d={area} fill={`url(#${id}-area)`} className={still ? undefined : 'chart-area-in'} />
        <path
          key={`line-${animateKey}`}
          d={line}
          pathLength={1}
          fill="none"
          stroke={`url(#${id}-stroke)`}
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={still ? undefined : 'chart-line-in'}
        />
        <g key={`dot-${animateKey}`} className={still ? undefined : 'chart-dot-in'}>
          <circle cx={last.x} cy={last.y} r="2.6" fill="#FFF6C2" stroke="#F9DF32" strokeWidth="1" />
        </g>
      </svg>
      {/* pulsing halo on the latest point — an HTML layer so the SVG is never repainted by it */}
      <span
        key={`halo-${animateKey}`}
        className={cn('pointer-events-none absolute size-[14px] -translate-x-1/2 -translate-y-1/2', !still && 'chart-dot-in')}
        style={{ left: `${(last.x / W) * 100}%`, top: `${(last.y / H) * 100}%` }}
      >
        <span className="animate-chart-pulse block size-full rounded-full bg-gold-bright will-change-transform" />
      </span>
    </div>
  )
}
