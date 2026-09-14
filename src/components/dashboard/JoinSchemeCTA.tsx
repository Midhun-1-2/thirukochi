import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { luxuryEase, springSoft } from '@/lib/motion'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldParticles } from '@/components/motion/GoldParticles'

/* ------------------------------------------------------------------
   JoinSchemeCTA
   card     — rich gold-edged panel for the dashboard grid (md+)
   floating — mobile bottom-right "+" that stretches into the full
              action on tap, hides when keyboard opens
------------------------------------------------------------------- */

interface JoinSchemeCTAProps {
  variant?: 'card' | 'floating'
  visible?: boolean
  className?: string
}

export function JoinSchemeCTA({ variant = 'card', visible = true, className }: JoinSchemeCTAProps) {
  if (variant === 'floating') return <FloatingCTA visible={visible} />

  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={springSoft}
      aria-labelledby="join-scheme-heading"
      className={cn(
        'gold-edge relative flex flex-col justify-between overflow-clip rounded-[var(--radius-lg)] p-6 sm:p-7',
        'bg-[linear-gradient(150deg,#6e0a0a_0%,#3a0000_48%,#1c0000_100%)] shadow-luxury',
        className,
      )}
    >
      <GoldGlow className="-right-24 -top-24" size={320} intensity={0.4} drift />
      <GoldParticles count={6} seed={11} opacity={0.6} />
      <DiamondMotif />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] px-3 py-1 text-[10.5px] uppercase tracking-[0.2em] text-gold-bright">
          <Sparkles size={12} aria-hidden /> Gold Schemes
        </span>
        <h2 id="join-scheme-heading" className="mt-4 font-display text-[clamp(24px,2.4vw,32px)] font-medium leading-[1.12] text-cream text-balance">
          Begin your gold journey, one instalment at a time.
        </h2>
        <p className="mt-3 max-w-[38ch] text-[13.5px] leading-relaxed text-cream-muted">
          Choose a scheme, set a monthly amount and watch your plan grow towards your next treasured piece.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-gold-pale">
          <li className="inline-flex items-center gap-1.5"><ShieldCheck size={14} aria-hidden className="text-gold-bright" /> Safe &amp; secure</li>
          <li className="inline-flex items-center gap-1.5"><ShieldCheck size={14} aria-hidden className="text-gold-bright" /> Flexible tenure</li>
        </ul>
      </div>

      <div className="relative mt-6">
        <GoldButton to={routes.joinScheme} size="lg" icon={<Plus strokeWidth={2.4} />} iconRight={<ArrowRight />} className="w-full sm:w-auto">
          Join Scheme
        </GoldButton>
      </div>
    </motion.section>
  )
}

/**
 * Floating action for phones: a plain gold "+" at rest. A tap stretches
 * it into the full "Join Scheme" pill (the label slides in as it grows)
 * and, once fully open, takes the member to the Join Scheme page.
 */
const FAB_CLOSED = 56
const FAB_OPEN = 176

function FloatingCTA({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: luxuryEase, delay: 0.1 }}
          className="fixed right-4 z-40 lg:hidden"
          style={{ bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)' }}
        >
          <FabButton />
          {/* soft halo */}
          <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(249,223,50,0.35),transparent_70%)] blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Lives inside the presence wrapper so its open state resets whenever the action hides. */
function FabButton() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  const go = () => navigate(routes.joinScheme)
  const onTap = () => {
    if (open) return
    if (reduced) {
      go()
      return
    }
    setOpen(true)
  }

  return (
    <motion.button
      type="button"
      aria-label="Join Scheme"
      aria-expanded={open}
      onClick={onTap}
      initial={false}
      animate={{ width: open ? FAB_OPEN : FAB_CLOSED }}
      transition={{ duration: 0.38, ease: luxuryEase }}
      onAnimationComplete={() => {
        if (open) go()
      }}
      className={cn(
        'group relative flex h-14 items-center overflow-clip rounded-full pl-3',
        'gold-bg-button text-maroon-dark text-[14px] font-semibold',
        'shadow-[0_14px_36px_rgba(249,223,50,0.32),0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]',
      )}
    >
      <span aria-hidden className="absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] transition-transform duration-[900ms] group-hover:translate-x-[120%]" />
      <motion.span
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.38, ease: luxuryEase }}
        className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(38,0,0,0.16)]"
      >
        <Plus size={18} strokeWidth={2.6} aria-hidden />
      </motion.span>
      <motion.span
        aria-hidden={!open}
        initial={false}
        animate={{ opacity: open ? 1 : 0, x: open ? 0 : -8 }}
        transition={{ duration: 0.3, ease: luxuryEase, delay: open ? 0.08 : 0 }}
        className="relative ml-2.5 whitespace-nowrap pr-5"
      >
        Join Scheme
      </motion.span>
    </motion.button>
  )
}

function DiamondMotif() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -bottom-8 right-6 h-36 w-36 opacity-[0.22]" viewBox="0 0 120 120" fill="none">
      <path d="M30 40h60l-30 60z" stroke="#F9DF32" strokeWidth="0.8" />
      <path d="M30 40l15-18h30l15 18" stroke="#F9DF32" strokeWidth="0.8" />
      <path d="M45 22l15 18 15-18M30 40l30 60M90 40L60 100M45 22l-7 18M75 22l7 18" stroke="#F9DF32" strokeWidth="0.5" />
      <path d="M60 40l-12-18M60 40l12-18" stroke="#F9DF32" strokeWidth="0.5" />
    </svg>
  )
}
