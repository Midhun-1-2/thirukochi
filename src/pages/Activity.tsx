import { useState } from 'react'
import { motion } from 'framer-motion'
import { activityMockConfig, mockActivity, type ActivityType } from '@/data'
import { cn } from '@/lib/cn'
import { demo } from '@/lib/demo'
import { luxuryEase, springSoft } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { GoldCard } from '@/components/ui/GoldCard'

const filters: { id: 'all' | ActivityType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'scheme', label: 'Schemes' },
  { id: 'payment', label: 'Payments' },
  { id: 'rate', label: 'Gold rate' },
  { id: 'reminder', label: 'Reminders' },
  { id: 'offer', label: 'Offers' },
]

export default function Activity() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const all = activityMockConfig.simulateEmpty || demo.emptyActivity ? [] : mockActivity
  const items = filter === 'all' ? all : all.filter((a) => a.type === filter)

  return (
    <PageTransition>
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-[860px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: luxuryEase }} className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-muted">Timeline</p>
            <h1 className="mt-1 font-display text-[clamp(26px,4vw,34px)] font-medium text-cream">Activity</h1>
          </motion.div>

          <div role="tablist" aria-label="Filter activity" className="scrollbar-none -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => {
              const active = f.id === filter
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'relative h-10 shrink-0 rounded-full border px-4 text-[12.5px] font-medium transition-colors',
                    active ? 'border-transparent text-maroon-dark' : 'border-[rgba(249,223,50,0.2)] text-cream-muted hover:text-cream',
                  )}
                >
                  {active && <motion.span layoutId="activity-filter" transition={springSoft} className="absolute inset-0 rounded-full gold-bg" />}
                  <span className="relative">{f.label}</span>
                </button>
              )
            })}
          </div>

          <GoldCard>
            <ActivityFeed key={filter} items={items} bare />
          </GoldCard>
        </div>
      </PageContainer>
    </PageTransition>
  )
}
