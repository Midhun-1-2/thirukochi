import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'
import { luxuryEase } from '@/lib/motion'

interface AuthHeaderProps {
  title: string
  subtitle?: string
  /** 1-based step in the 3-step onboarding (Register → OTP → MPIN). */
  step?: 1 | 2 | 3
  back?: { to: string; label: string } | { onClick: () => void; label: string }
  align?: 'left' | 'center'
}

const steps = ['Register', 'Verify', 'Secure']
const backClasses = 'group mb-3 inline-flex h-9 sm:mb-4 sm:h-10 items-center gap-2 rounded-full pr-3 text-[13px] text-gold-muted transition-colors hover:text-gold-bright'

export function AuthHeader({ title, subtitle, step, back, align = 'left' }: AuthHeaderProps) {
  return (
    <div className={cn('mb-6 sm:mb-7', align === 'center' && 'text-center')}>
      {back && (
        <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          {'to' in back ? (
            <Link to={back.to} className={backClasses}>
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {back.label}
            </Link>
          ) : (
            <button type="button" onClick={back.onClick} className={backClasses}>
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {back.label}
            </button>
          )}
        </motion.div>
      )}

      {step && (
        <motion.ol
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: luxuryEase }}
          aria-label="Onboarding progress"
          className={cn('mb-4 flex items-center gap-2 sm:mb-5', align === 'center' && 'justify-center')}
        >
          {steps.map((label, i) => {
            const n = i + 1
            const done = n < step
            const active = n === step
            return (
              <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
                <span
                  className={cn(
                    'relative h-1.5 rounded-full transition-all duration-500',
                    active ? 'w-9 gold-bg shadow-[0_0_10px_rgba(249,223,50,0.5)]' : done ? 'w-5 bg-gold' : 'w-5 bg-[rgba(249,223,50,0.18)]',
                  )}
                />
                <span className="sr-only">
                  {label} {done ? 'completed' : active ? 'current' : ''}
                </span>
              </li>
            )
          })}
          <li className="ml-1 text-[11px] uppercase tracking-[0.2em] text-gold-muted" aria-hidden>
            Step {step} of {steps.length}
          </li>
        </motion.ol>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: luxuryEase, delay: 0.08 }}
        className="font-display text-[clamp(30px,4vw,40px)] font-medium leading-[1.12] text-cream text-balance"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: luxuryEase, delay: 0.18 }}
          className="mt-2 text-[14px] leading-relaxed text-cream-muted text-pretty sm:mt-3 sm:text-[14.5px]"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
