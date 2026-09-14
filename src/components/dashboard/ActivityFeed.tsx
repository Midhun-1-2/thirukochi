import { motion } from 'framer-motion'
import { BadgeCheck, Bell, Coins, Gem, Sparkles, type LucideIcon } from 'lucide-react'
import { routes } from '@/app/navigation'
import type { ActivityItem, ActivityType } from '@/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { luxuryEase, staggerContainer } from '@/lib/motion'
import { GoldCard } from '@/components/ui/GoldCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

/* ------------------------------------------------------------------
   ActivityFeed — a gold timeline: vertical gold line, glowing status
   nodes, dark content surfaces. Includes a designed empty state.
------------------------------------------------------------------- */

interface ActivityFeedProps {
  items: ActivityItem[]
  limit?: number
  showViewAll?: boolean
  title?: string
  className?: string
  /** Render without the card chrome (used on the full Activity page). */
  bare?: boolean
}

const typeIcon: Record<ActivityType, LucideIcon> = {
  scheme: Gem,
  payment: BadgeCheck,
  rate: Coins,
  reminder: Bell,
  offer: Sparkles,
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: luxuryEase } },
}

export function ActivityFeed({ items, limit, showViewAll = true, title = 'Activity Feed', className, bare }: ActivityFeedProps) {
  const list = limit ? items.slice(0, limit) : items
  const reduced = useReducedMotion()

  const content = (
    <>
      {!bare && (
        <SectionHeading title={title} action={showViewAll && items.length > 0 ? { label: 'View All', to: routes.activity } : undefined} className="mb-5" />
      )}

      {list.length === 0 ? (
        <ActivityEmpty />
      ) : (
        <motion.ol
          variants={staggerContainer(0.09, 0.15)}
          initial="hidden"
          animate="show"
          className="relative flex flex-col"
          aria-label="Recent activity"
        >
          {/* timeline rail */}
          <motion.span
            aria-hidden
            initial={reduced ? undefined : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.1, ease: luxuryEase, delay: 0.15 }}
            className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-[linear-gradient(180deg,rgba(249,223,50,0.6),rgba(179,135,28,0.35)_60%,transparent)]"
          />

          {list.map((item) => {
            const Icon = typeIcon[item.type]
            return (
              <motion.li key={item.id} variants={itemVariants} className="relative flex gap-4 py-2.5">
                <span
                  className={cn(
                    'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-[#1f0000]',
                    item.unread
                      ? 'border-gold-bright/70 text-gold-bright shadow-[0_0_0_4px_rgba(249,223,50,0.08),0_0_16px_rgba(249,223,50,0.35)]'
                      : 'border-[rgba(249,223,50,0.28)] text-gold-muted',
                  )}
                >
                  <Icon size={17} strokeWidth={1.6} aria-hidden />
                </span>

                <div className="min-w-0 flex-1 rounded-[14px] border border-[rgba(249,223,50,0.08)] bg-[rgba(13,0,0,0.35)] px-4 py-3 transition-colors hover:border-[rgba(249,223,50,0.2)]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-medium leading-snug text-cream">
                      {item.title}
                      {item.unread && <span className="sr-only"> (new)</span>}
                    </p>
                    <time className="shrink-0 text-[11px] tracking-[0.04em] text-gold-muted">{item.time}</time>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-cream-muted">{item.description}</p>
                </div>
              </motion.li>
            )
          })}
        </motion.ol>
      )}
    </>
  )

  if (bare) return <div className={className}>{content}</div>
  return (
    <GoldCard variant="default" className={className}>
      {content}
    </GoldCard>
  )
}

export function ActivityEmpty() {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <motion.div
        aria-hidden
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-5"
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,223,50,0.25),transparent_70%)] blur-md" />
        <svg viewBox="0 0 80 80" className="relative h-20 w-20" fill="none">
          <circle cx="40" cy="40" r="34" stroke="rgba(249,223,50,0.35)" strokeWidth="1" strokeDasharray="3 6" />
          <path d="M22 44c6-10 12-14 18-14s12 4 18 14" stroke="url(#empty-gold)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M28 52h24" stroke="rgba(249,223,50,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="40" cy="30" r="3" fill="#F9DF32" />
          <defs>
            <linearGradient id="empty-gold" x1="22" y1="30" x2="58" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#91640F" />
              <stop offset="0.5" stopColor="#F9DF32" />
              <stop offset="1" stopColor="#B3871C" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <p className="font-display text-[19px] font-medium text-cream">No recent activity</p>
      <p className="mt-1.5 max-w-[30ch] text-[13px] leading-relaxed text-cream-muted">Your latest account activity will appear here.</p>
    </div>
  )
}
