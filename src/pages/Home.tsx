import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useGoldRate } from '@/hooks/useGoldRate'
import { activityMockConfig, mockActivity, mockPromos, mockSocial } from '@/data'
import { demo } from '@/lib/demo'
import { greeting } from '@/lib/format'
import { luxuryEase, staggerContainer, staggerItem } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldRibbon } from '@/components/motion/GoldRibbon'
import { GoldRateCard } from '@/components/gold-rate/GoldRateCard'
import { ReferralCard } from '@/components/dashboard/ReferralCard'
import { PromoCarousel } from '@/components/dashboard/PromoCarousel'
import { SocialLinks } from '@/components/dashboard/SocialLinks'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { JoinSchemeCTA } from '@/components/dashboard/JoinSchemeCTA'

/* ------------------------------------------------------------------
   Home — the dashboard.
   Mobile : single column          Tablet : 2 columns
   Desktop: 12-col grid (rate 8 / referral 4 · promo 12 · feed 7 / cta 5)
------------------------------------------------------------------- */

export default function Home() {
  const { user } = useAuth()
  const rate = useGoldRate()
  const activity = activityMockConfig.simulateEmpty || demo.emptyActivity ? [] : mockActivity
  const firstName = (user?.name ?? 'Member').split(' ')[0]

  return (
    <PageTransition className="relative overflow-clip">
      {/* signature: liquid gold flowing along the bottom */}
      <GoldRibbon variant="wave" opacity={0.28} className="top-auto bottom-0 h-[38%] max-h-[420px]" draw={false} fade="x" />

      <PageContainer className="relative py-5 sm:py-6 lg:py-8">
        {/* mobile greeting (desktop greeting lives in the header) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: luxuryEase }}
          className="mb-5 lg:hidden"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-muted">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="mt-0.5 font-display text-[26px] font-medium leading-tight text-cream sm:text-[30px]">
            {greeting()}, <span className="gold-text">{firstName}</span>
          </h1>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-12 lg:gap-6"
        >
          {/* Gold rate — visually dominant */}
          <motion.div variants={staggerItem} className="md:col-span-8">
            <GoldRateCard status={rate.status} data={rate.data} onRetry={rate.refresh} className="h-full" />
          </motion.div>

          {/* Referral */}
          <motion.div variants={staggerItem} className="md:col-span-4">
            <ReferralCard code={user?.referralCode ?? '—'} className="h-full" />
          </motion.div>

          {/* Promotional campaign */}
          <motion.div variants={staggerItem} className="md:col-span-12">
            <PromoCarousel slides={mockPromos} />
          </motion.div>

          {/* Join scheme — strong CTA (also floating on mobile) */}
          <motion.div variants={staggerItem} className="md:col-span-5 md:order-2 lg:col-span-5">
            <JoinSchemeCTA variant="card" className="h-full" />
          </motion.div>

          {/* Activity */}
          <motion.div variants={staggerItem} className="md:col-span-7 md:order-1 lg:col-span-7">
            <ActivityFeed items={activity} limit={4} className="h-full" />
          </motion.div>

          {/* Social */}
          <motion.div variants={staggerItem} className="md:col-span-12 md:order-3">
            <SocialLinks links={mockSocial} layout="card" />
          </motion.div>
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-cream-faint lg:mt-10">
          Prototype with demo data · Thirukochi Gold &amp; Diamonds
        </p>
      </PageContainer>
    </PageTransition>
  )
}
