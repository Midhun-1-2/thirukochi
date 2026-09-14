import { cloneElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { GoldRibbon } from '@/components/motion/GoldRibbon'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { luxuryEase } from '@/lib/motion'

/* ------------------------------------------------------------------
   AuthLayout — immersive, cinematic frame shared by Register, OTP,
   MPIN and Login. The brand panel persists; only the form column
   transitions between routes.
------------------------------------------------------------------- */

export function AuthLayout() {
  const outlet = useOutlet()
  const location = useLocation()

  return (
    <div className="bg-cinematic relative min-h-dvh w-full overflow-clip">
      {/* ambient light + particles */}
      <GoldGlow className="-left-40 -top-40 hidden lg:block" size={640} intensity={0.22} />
      <GoldGlow className="-bottom-52 right-[-10%]" size={560} intensity={0.16} />
      <GoldParticles count={16} seed={3} opacity={0.55} />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[1.05fr_1fr] 2xl:grid-cols-[1.15fr_1fr]">
        {/* ---------------- Brand panel (desktop) ---------------- */}
        <aside className="relative hidden overflow-clip lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12 xl:px-20">
          <GoldRibbon variant="arc" opacity={0.5} className="-bottom-24 top-auto h-[48%]" fade="right" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: luxuryEase }}
          >
            <Logo size="lg" glow priority />
          </motion.div>

          <div className="relative z-10 max-w-[520px]">
            <span aria-hidden className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(22,0,0,0.75),rgba(22,0,0,0)_70%)]" />
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: luxuryEase, delay: 0.25 }}
              className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold-muted"
            >
              Private Gold Membership
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: luxuryEase, delay: 0.35 }}
              className="font-display text-[clamp(38px,3.6vw,58px)] font-medium leading-[1.08] text-cream text-balance"
            >
              Timeless beauty <span className="gold-text-shine italic">in every journey.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: luxuryEase, delay: 0.5 }}
              className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-cream-muted"
            >
              A private digital space for your gold — live rates, curated schemes and your growing collection, all in one
              place.
            </motion.p>
          </div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative z-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-gold-muted"
          >
            <li>Tradition</li>
            <li aria-hidden className="size-1 rotate-45 bg-gold-bright/70" />
            <li>Trust</li>
            <li aria-hidden className="size-1 rotate-45 bg-gold-bright/70" />
            <li>Together</li>
          </motion.ul>
        </aside>

        {/* ---------------- Form column ---------------- */}
        <main className="relative flex min-h-dvh flex-col lg:min-h-0">
          {/* mobile ribbon */}
          <GoldRibbon variant="sweep" opacity={0.55} className="top-auto -bottom-6 h-[46%] lg:hidden" flip />

          <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-[calc(28px+var(--safe-top))] sm:px-8 lg:justify-center lg:px-12 lg:py-16 xl:px-20">
            {/* mobile logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="mx-auto mb-8 lg:hidden"
            >
              <Logo size="md" glow priority />
            </motion.div>

            <div className="mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-[460px]">
              <AnimatePresence mode="wait">{outlet && cloneElement(outlet, { key: location.pathname })}</AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
