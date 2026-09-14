import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
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
  const entrance = useEntrance()
  // Copy reveals only on the page's first showing; afterwards it is simply there.
  const from = (v: Record<string, number>) => (entrance ? v : false)
  return (
    <section
      aria-labelledby="scheme-hero-title"
      className={cn(
        'gold-edge relative overflow-clip rounded-[var(--radius-lg)] shadow-luxury',
        'bg-[linear-gradient(160deg,#6e0a0a_0%,#3a0000_45%,#160000_100%)]',
        compact ? 'px-4 py-3.5 sm:p-6' : 'flex min-h-[400px] flex-col justify-between p-8 xl:p-10',
        className,
      )}
    >
      <GoldGlow className="-right-28 -top-28" size={420} intensity={0.36} />
      <GoldGlow className="-bottom-32 -left-20" size={300} intensity={0.18} />
      <GoldRibbon variant="wave" opacity={0.55} className="top-auto -bottom-4 h-[55%]" />
      <GoldParticles count={12} seed={5} opacity={0.6} />

      <div className={cn('relative', compact ? 'pr-8' : 'max-w-[92%]')}>
        <motion.span
          initial={from({ opacity: 0, y: 8 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] uppercase tracking-[0.22em] text-gold-bright',
            compact ? 'px-2.5 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-[10.5px]' : 'px-3 py-1 text-[10.5px]',
          )}
        >
          <Sparkles size={12} aria-hidden /> Gold Schemes
        </motion.span>

        <motion.h1
          id="scheme-hero-title"
          initial={from({ opacity: 0, y: 18 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: luxuryEase, delay: 0.18 }}
          className={cn(
            'font-display font-medium leading-[1.08] text-cream text-balance',
            compact ? 'mt-2 text-[clamp(20px,5.2vw,32px)] sm:mt-4' : 'mt-4 text-[clamp(30px,3vw,44px)]',
          )}
        >
          Secure Your Future with <span className="gold-text-shine italic">Gold Schemes</span>
        </motion.h1>

        <motion.p
          initial={from({ opacity: 0, y: 12 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.3 }}
          className={cn('font-display italic text-gold-pale', compact ? 'mt-1 text-[13px] sm:mt-3 sm:text-[16px]' : 'mt-3 text-[16px] sm:text-[18px]')}
        >
          Small Steps. Big Dreams.
        </motion.p>

        {!compact && (
          <motion.p
            initial={from({ opacity: 0, y: 12 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.4 }}
            className="mt-4 max-w-[36ch] text-[13.5px] leading-relaxed text-cream-muted"
          >
            Set aside a fixed amount each month towards the jewellery you have always wanted. Choose the scheme, the
            amount and the tenure that suit you.
          </motion.p>
        )}
      </div>

      {/* jewellery ornament */}
      <motion.div
        aria-hidden
        initial={from({ opacity: 0, scale: 0.9, rotate: -6 })}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: luxuryEase, delay: 0.35 }}
        className={cn('pointer-events-none absolute', compact ? '-right-6 -bottom-6 w-[110px] opacity-60 sm:-right-8 sm:-bottom-8 sm:w-[150px]' : 'right-2 bottom-8 w-[34%] xl:right-4 xl:w-[32%]')}
      >
        <img src="/assets/jewellery/ornament-ring.svg" alt="" className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" loading="lazy" />
      </motion.div>

      {!compact && (
        <motion.ul
          initial={from({ opacity: 0 })}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative mt-8 flex max-w-[58%] flex-col gap-2 text-[13px] text-gold-pale"
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
