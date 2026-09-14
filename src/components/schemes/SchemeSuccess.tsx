import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Gem, IndianRupee } from 'lucide-react'
import { routes } from '@/app/navigation'
import type { JoinedScheme, Scheme } from '@/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatINR } from '@/lib/format'
import { luxuryEase } from '@/lib/motion'
import { mulberry32 } from '@/lib/random'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { GoldParticles } from '@/components/motion/GoldParticles'

/* ------------------------------------------------------------------
   SchemeSuccess — the celebration.
   1 gold particles → 2 ring expands → 3 check draws → 4 check pops
   → 5 heading → 6 summary rises → 7 CTAs
   Jewellery-like particles; never confetti. Gold, never green.
------------------------------------------------------------------- */

interface SchemeSuccessProps {
  scheme?: Scheme
  joined: JoinedScheme
}

const T = {
  burst: 0.05,
  ring: 0.2,
  check: 0.7,
  pop: 1.15,
  heading: 1.3,
  sub: 1.45,
  card: 1.6,
  cta: 1.95,
}

export function SchemeSuccess({ scheme, joined }: SchemeSuccessProps) {
  const reduced = useReducedMotion()
  const d = (t: number) => (reduced ? 0 : t)

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
      <GoldParticles count={20} seed={17} opacity={0.6} className="-inset-x-10 -top-10 h-[360px]" />

      {/* ---- emblem ---- */}
      <div className="relative mb-5 flex size-[148px] items-center justify-center sm:mb-8 sm:size-[188px]">
        <Burst delay={d(T.burst)} />

        {/* halo */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: luxuryEase, delay: d(T.ring) }}
          className="absolute inset-[-30px] rounded-full bg-[radial-gradient(circle,rgba(249,223,50,0.32),rgba(249,223,50,0.08)_45%,transparent_70%)] blur-xl"
        />

        {/* outer ring */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: luxuryEase, delay: d(T.ring) }}
          className="absolute inset-0 rounded-full border border-[rgba(249,223,50,0.45)]"
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: luxuryEase, delay: d(T.ring + 0.05) }}
          className="absolute inset-[10px] rounded-full border border-dashed border-[rgba(249,223,50,0.35)]"
        />

        {/* gold disc */}
        <motion.span
          aria-hidden
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.04, 1], opacity: 1 }}
          transition={{ duration: 0.7, ease: luxuryEase, delay: d(T.ring + 0.1) }}
          className="absolute inset-[28px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3b0_0%,#f9df32_28%,#d9b32a_58%,#91640f_100%)] shadow-[0_18px_50px_rgba(249,223,50,0.35),inset_0_-8px_20px_rgba(120,80,0,0.35),inset_0_6px_14px_rgba(255,255,255,0.45)]"
        />

        {/* check */}
        <motion.svg
          viewBox="0 0 64 64"
          className="relative size-[68px] text-maroon-dark sm:size-[84px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.14, 1] }}
          transition={{ duration: 0.45, ease: luxuryEase, delay: d(T.pop) }}
          role="img"
          aria-label="Success"
        >
          <motion.path
            d="M16 33.5l11 11L48 22"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: luxuryEase, delay: d(T.check) }}
          />
        </motion.svg>
      </div>

      {/* ---- copy ---- */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: luxuryEase, delay: d(T.heading) }}
        className="font-display text-[clamp(28px,5vw,40px)] font-medium leading-[1.12] text-cream text-balance"
      >
        Scheme Joined <span className="gold-text-shine">Successfully!</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: luxuryEase, delay: d(T.sub) }}
        className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-cream-muted sm:mt-3 sm:text-[14.5px]"
      >
        Your scheme has been activated. Reference <span className="text-gold-pale lining-nums">{joined.referenceNo}</span>
      </motion.p>

      {/* ---- summary ---- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: luxuryEase, delay: d(T.card) }}
        className="mt-5 w-full sm:mt-8"
      >
        <GoldCard variant="edge" padding="sm" className="text-left">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[rgba(249,223,50,0.35)] bg-[rgba(249,223,50,0.08)] text-gold-bright">
              <Gem size={19} strokeWidth={1.7} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[18px] font-medium text-cream">{scheme?.name ?? 'Gold Scheme'}</p>
              <p className="text-[12px] text-cream-faint">Activated today</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat icon={<IndianRupee size={14} aria-hidden />} label="Monthly" value={formatINR(joined.amount, { whole: true })} />
            <Stat icon={<CalendarDays size={14} aria-hidden />} label="Tenure" value={`${joined.tenure} Months`} />
          </div>
        </GoldCard>
      </motion.div>

      {/* ---- actions ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: luxuryEase, delay: d(T.cta) }}
        className="mt-4 flex w-full flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3"
      >
        <GoldButton to={routes.home} size="lg" fullWidth iconRight={<ArrowRight />}>
          Go to Home
        </GoldButton>
        <GoldButton to={routes.schemes} variant="secondary" size="lg" fullWidth>
          View Scheme Details
        </GoldButton>
      </motion.div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[rgba(13,0,0,0.35)] px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-gold-muted">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-[20px] font-medium text-gold-bright lining-nums">{value}</p>
    </div>
  )
}

/** Radiating jewellery particles — small facets and dots. */
function Burst({ delay }: { delay: number }) {
  const reduced = useReducedMotion()
  const shards = useMemo(() => {
    const rand = mulberry32(99)
    return Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (rand() - 0.5) * 0.4
      const dist = 90 + rand() * 60
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 3 + rand() * 4,
        diamond: rand() > 0.5,
        dur: 1.1 + rand() * 0.5,
        delay: delay + rand() * 0.15,
      }
    })
  }, [delay])

  if (reduced) return null

  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {shards.map((s) => (
        <motion.span
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.5] }}
          transition={{ duration: s.dur, ease: [0.16, 1, 0.3, 1], delay: s.delay }}
          className="absolute -ml-1 -mt-1 block"
          style={{
            width: s.size,
            height: s.size,
            borderRadius: s.diamond ? 1 : 999,
            transform: s.diamond ? 'rotate(45deg)' : undefined,
            background: 'radial-gradient(circle at 35% 30%, #fff6c2, #f9df32 50%, #b3871c)',
            boxShadow: '0 0 10px rgba(249,223,50,0.8)',
          }}
        />
      ))}
    </span>
  )
}
