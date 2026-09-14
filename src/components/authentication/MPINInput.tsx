import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { shakeVariants, springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   MPINInput — 4 dots. Each dot scales in with a gold glow.
------------------------------------------------------------------- */

interface MPINInputProps {
  length?: number
  value: string
  status?: 'idle' | 'error' | 'success'
  label?: string
  className?: string
}

export function MPINInput({ length = 4, value, status = 'idle', label = 'MPIN', className }: MPINInputProps) {
  return (
    <motion.div
      role="group"
      aria-label={`${label}, ${value.length} of ${length} digits entered`}
      variants={shakeVariants}
      animate={status === 'error' ? 'shake' : 'idle'}
      className={cn('flex items-center justify-center gap-5 sm:gap-6', className)}
    >
      {Array.from({ length }, (_, i) => {
        const filled = i < value.length
        const active = i === value.length && status === 'idle'
        return (
          <span
            key={i}
            className={cn(
              'relative flex size-[52px] items-center justify-center rounded-[16px] border transition-[border-color,box-shadow,background-color] duration-300 sm:size-14',
              'bg-[rgba(38,0,0,0.6)]',
              status === 'error'
                ? 'border-rose/70'
                : status === 'success'
                  ? 'border-gold-bright bg-[rgba(249,223,50,0.08)] shadow-[0_0_22px_rgba(249,223,50,0.25)]'
                  : filled
                    ? 'border-gold/80 shadow-[0_0_14px_rgba(249,223,50,0.14)]'
                    : 'border-[rgba(249,223,50,0.22)]',
              active && 'border-gold-bright shadow-[0_0_0_3px_rgba(249,223,50,0.12),0_0_20px_rgba(249,223,50,0.2)]',
            )}
          >
            {/* caret pulse */}
            {active && (
              <motion.span
                aria-hidden
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-5 w-px bg-gold-bright"
              />
            )}
            <motion.span
              aria-hidden
              initial={false}
              animate={filled ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={springSnappy}
              className={cn(
                'block size-3.5 rounded-full',
                status === 'error'
                  ? 'bg-rose shadow-[0_0_10px_rgba(240,160,140,0.6)]'
                  : 'bg-[radial-gradient(circle_at_35%_30%,#fff6c2,#f9df32_45%,#b3871c)] shadow-[0_0_12px_rgba(249,223,50,0.8)]',
              )}
            />
          </span>
        )
      })}
    </motion.div>
  )
}
