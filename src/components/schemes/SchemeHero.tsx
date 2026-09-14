import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { luxuryEase } from '@/lib/motion'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { GoldRibbon } from '@/components/motion/GoldRibbon'

/* ------------------------------------------------------------------
   SchemeHero — visual introduction for the Join Scheme flow.
   Desktop: tall left panel.  Mobile: compact banner above the form.
------------------------------------------------------------------- */

interface SchemeHeroProps {
  className?: string
  compact?: boolean
}

export function SchemeHero({ className, compact }: SchemeHeroProps) {
  return (
    <section
      aria-labelledby="scheme-hero-title"
      className={cn(
        'gold-edge relative overflow-clip rounded-[var(--radius-lg)] shadow-luxury',
        'bg-[linear-gradient(160deg,#6e0a0a_0%,#3a0000_45%,#160000_100%)]',
        compact ? 'p-6' : 'flex min-h-[560px] flex-col justify-between p-8 xl:p-10',
        className,
      )}
    >
      <GoldGlow className="-right-28 -top-28" size={420} intensity={0.36} />
      <GoldGlow className="-bottom-32 -left-20" size={300} intensity={0.18} />
      <GoldRibbon variant="wave" opacity={0.55} className="top-auto -bottom-4 h-[55%]" />
      <GoldParticles count={12} seed={5} opacity={0.6} />

      <div className={cn('relative', compact ? 'pr-8' : 'max-w-[92%]')}>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] px-3 py-1 text-[10.5px] uppercase tracking-[0.22em] text-gold-bright"
        >
          <Sparkles size={12} aria-hidden /> Gold Schemes
        </motion.span>

        <motion.h1
          id="scheme-hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: luxuryEase, delay: 0.18 }}
          className={cn(
            'mt-4 font-display font-medium leading-[1.08] text-cream text-balance',
            compact ? 'text-[clamp(26px,6vw,34px)]' : 'text-[clamp(32px,3.2vw,48px)]',
          )}
        >
          Secure Your Future with <span className="gold-text-shine italic">Gold Schemes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.3 }}
          className="mt-3 font-display text-[16px] italic text-gold-pale sm:text-[18px]"
        >
          Small Steps. Big Dreams.
        </motion.p>

        {!compact && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.4 }}
            className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-cream-muted"
          >
            Set aside a fixed amount each month towards the jewellery you have always wanted. Choose the scheme, the
            amount and the tenure that suit you.
          </motion.p>
        )}
      </div>

      {/* jewellery ornament */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: luxuryEase, delay: 0.35 }}
        className={cn('pointer-events-none absolute', compact ? '-right-8 -bottom-8 w-[150px] opacity-60' : 'right-2 bottom-10 w-[38%] xl:right-4 xl:w-[36%]')}
      >
        <img src="/assets/jewellery/ornament-ring.svg" alt="" className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" loading="lazy" />
      </motion.div>

      {!compact && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative mt-10 flex max-w-[58%] flex-col gap-2.5 text-[13px] text-gold-pale"
        >
          {['Choose from curated schemes', 'Flexible monthly amounts', 'Track everything in one place'].map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-gold-bright" aria-hidden />
              {t}
            </li>
          ))}
        </motion.ul>
      )}
    </section>
  )
}
