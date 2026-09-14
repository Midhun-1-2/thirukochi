import { motion } from 'framer-motion'
import type { GoldRate } from '@/data'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

interface GoldRateSelectorProps {
  rates: GoldRate[]
  value: string
  onChange: (id: string) => void
  className?: string
}

/** Segmented control: 1G 22K · 8G 22K · 1G 18K */
export function GoldRateSelector({ rates, value, onChange, className }: GoldRateSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Select gold rate"
      className={cn('inline-flex rounded-full border border-[rgba(249,223,50,0.18)] bg-[rgba(13,0,0,0.45)] p-1', className)}
    >
      {rates.map((r) => {
        const active = r.id === value
        const short = `${r.weightGrams}G ${r.purity}`
        return (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r.id)}
            className={cn(
              'relative h-10 min-w-[68px] rounded-full px-3.5 text-[12px] font-semibold tracking-[0.06em] transition-colors duration-200',
              active ? 'text-maroon-dark' : 'text-cream-muted hover:text-cream',
            )}
          >
            {active && (
              <motion.span
                layoutId="gold-rate-selector"
                transition={springSoft}
                className="absolute inset-0 rounded-full gold-bg shadow-[0_6px_18px_rgba(249,223,50,0.28)]"
              />
            )}
            <span className="relative">{short}</span>
          </button>
        )
      })}
    </div>
  )
}
