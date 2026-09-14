import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, RefreshCw, WifiOff } from 'lucide-react'
import type { GoldRateData } from '@/data'
import type { GoldRateStatus } from '@/hooks/useGoldRate'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
import { formatChange, formatINR } from '@/lib/format'
import { luxuryEase } from '@/lib/motion'
import { GoldBadge } from '@/components/ui/GoldBadge'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldRateChart } from './GoldRateChart'
import { GoldRateSelector } from './GoldRateSelector'

/* ------------------------------------------------------------------
   GoldRateCard — the dashboard's hero. Consumes `GoldRateData`
   so a live feed can replace the mock without UI changes.
------------------------------------------------------------------- */

interface GoldRateCardProps {
  status: GoldRateStatus
  data: GoldRateData | null
  /** Data came from the session cache at mount — paint it without the reveal choreography. */
  fromCache?: boolean
  onRetry?: () => void
  className?: string
}

export function GoldRateCard({ status, data, fromCache, onRetry, className }: GoldRateCardProps) {
  const [selectedId, setSelectedId] = useState<string>('')
  const [interacted, setInteracted] = useState(false)
  const entrance = useEntrance()
  const rates = data?.rates ?? []
  const selected = rates.find((r) => r.id === selectedId) ?? rates[0]
  // Price count-up: on the first reveal, on fresh data, or when the member switches purity.
  // (The chart draws itself in on every showing — it is CSS-only and cheap.)
  const reveal = entrance || !fromCache || interacted

  const onSelect = (id: string) => {
    setInteracted(true)
    setSelectedId(id)
  }

  return (
    <GoldCard
      variant="edge"
      padding="none"
      className={cn('edge-spark-track overflow-clip', className)}
      aria-busy={status === 'loading'}
      aria-live="polite"
    >
      {/* signature: slowly moving golden radial glow */}
      <GoldGlow className="-right-24 -top-32" size={420} intensity={0.34} />
      <GoldGlow className="-bottom-40 -left-24" size={360} intensity={0.16} />
      <JewelleryPattern />
      {status === 'ready' && <span aria-hidden className="edge-spark" />}

      <div className="relative p-5 sm:p-6 lg:p-7">
        {/* header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-[19px] font-medium text-cream sm:text-[21px]">Today&rsquo;s Gold Rate</h2>
            {data?.live && status === 'ready' && <GoldBadge tone="live">Live</GoldBadge>}
          </div>
          <div className="text-[12px] tracking-[0.08em] text-cream-faint lining-nums">
            {status === 'ready' && data ? <time dateTime={data.updatedAt}>{data.date}</time> : <Skeleton className="h-3.5 w-20" />}
          </div>
        </div>

        {/* body */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
          <div className="min-w-0">
            {status === 'loading' && <RateSkeleton />}

            {status === 'error' && (
              <div className="flex flex-col items-start gap-4 py-2">
                <span className="flex size-11 items-center justify-center rounded-full border border-[rgba(249,223,50,0.25)] text-gold-muted">
                  <WifiOff size={20} strokeWidth={1.6} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[20px] font-medium text-cream">Gold rate unavailable</p>
                  <p className="mt-1 text-[13px] text-cream-muted">We couldn&rsquo;t reach the rate service. Please try again in a moment.</p>
                </div>
                <GoldButton variant="secondary" size="sm" icon={<RefreshCw />} onClick={onRetry}>
                  Retry
                </GoldButton>
              </div>
            )}

            {status === 'ready' && selected && (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: luxuryEase }}
                >
                  <p className="text-[12px] uppercase tracking-[0.2em] text-gold-muted">
                    {selected.label} <span className="mx-1.5 text-gold-bright/60">·</span> {selected.purity}
                  </p>
                  <p className="mt-1.5 font-display text-[clamp(36px,5.2vw,54px)] font-medium leading-none tracking-[-0.02em] lining-nums">
                    <span className="gold-text">
                      <AnimatedPrice value={selected.price} reveal={reveal} />
                    </span>
                  </p>
                  <ChangeIndicator change={selected.change} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* sparkline */}
          <div className="w-full max-w-[320px] lg:w-[250px] xl:w-[280px]">
            {status === 'loading' ? (
              <Skeleton className="h-[72px] w-full rounded-[12px]" />
            ) : status === 'ready' && selected ? (
              <div className="relative">
                <p className="mb-1 text-[10.5px] uppercase tracking-[0.18em] text-cream-faint">Recent movement</p>
                <div className="aspect-[240/72] w-full">
                  <GoldRateChart points={selected.history} animateKey={selected.id} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* footer */}
        {status !== 'error' && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {status === 'ready' && rates.length > 0 ? (
              <GoldRateSelector rates={rates} value={selected?.id ?? ''} onChange={onSelect} />
            ) : (
              <Skeleton className="h-11 w-[236px] rounded-full" />
            )}
            {data?.isDemo && status === 'ready' && (
              <p className="text-[11px] text-cream-faint">Indicative demo rate · not for transactions</p>
            )}
          </div>
        )}
      </div>
    </GoldCard>
  )
}

function ChangeIndicator({ change }: { change: number }) {
  const { text, direction } = formatChange(change)
  const Icon = direction === 'down' ? ArrowDownRight : ArrowUpRight
  return (
    <p
      className={cn(
        'mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-medium lining-nums',
        direction === 'down' ? 'bg-rose/10 text-rose' : direction === 'up' ? 'bg-[rgba(249,223,50,0.1)] text-gold-bright' : 'bg-[rgba(248,248,248,0.06)] text-cream-muted',
      )}
    >
      {direction !== 'flat' && <Icon size={14} strokeWidth={2.2} aria-hidden />}
      <span>
        <span className="sr-only">{direction === 'down' ? 'Down' : direction === 'up' ? 'Up' : 'Unchanged'} </span>
        {text}
      </span>
      <span className="font-normal text-cream-faint">vs last update</span>
    </p>
  )
}

/** Tween the number up from a lower value on first reveal. */
function AnimatedPrice({ value, reveal }: { value: number; reveal: boolean }) {
  const reduced = useReducedMotion()
  const countUp = reveal && !reduced
  const mv = useMotionValue(countUp ? value * 0.965 : value)
  const [display, setDisplay] = useState(() => formatINR(countUp ? value * 0.965 : value))

  useMotionValueEvent(mv, 'change', (v) => setDisplay(formatINR(v)))

  useEffect(() => {
    if (reduced || mv.get() === value) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 1.1, ease: luxuryEase })
    return () => controls.stop()
  }, [value, mv, reduced])

  return <>{display}</>
}

function RateSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-12 w-[220px] max-w-full" />
      <Skeleton className="h-6 w-40 rounded-full" />
    </div>
  )
}

/** Faint concentric jewellery geometry in the corner. */
function JewelleryPattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-[220px] w-[220px] opacity-[0.16]" viewBox="0 0 200 200" fill="none">
      {[92, 74, 56, 38].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} stroke="#F9DF32" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * 22.5 * Math.PI) / 180
        return <line key={i} x1={100 + 38 * Math.cos(a)} y1={100 + 38 * Math.sin(a)} x2={100 + 92 * Math.cos(a)} y2={100 + 92 * Math.sin(a)} stroke="#F9DF32" strokeWidth="0.4" />
      })}
    </svg>
  )
}
