import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { luxuryEase } from '@/lib/motion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { IconButton } from './IconButton'

/* ------------------------------------------------------------------
   Modal — bottom sheet on mobile, centred dialog on larger screens.
------------------------------------------------------------------- */

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const id = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current
      el?.focus()
    }, 50)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            tabIndex={-1}
            className="absolute inset-0 bg-[rgba(13,0,0,0.72)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={description ? `${id}-desc` : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: luxuryEase }}
            className={cn(
              'surface gold-edge relative w-full max-w-[460px] rounded-t-[26px] p-6 pb-[calc(24px+var(--safe-bottom))] outline-none sm:rounded-[26px] sm:pb-6',
              className,
            )}
          >
            <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-[rgba(249,223,50,0.28)] sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={`${id}-title`} className="font-display text-[22px] font-medium text-cream">
                  {title}
                </h2>
                {description && (
                  <p id={`${id}-desc`} className="mt-1.5 text-[13.5px] leading-relaxed text-cream-muted">
                    {description}
                  </p>
                )}
              </div>
              <IconButton label="Close" size="sm" onClick={onClose} className="-mr-2 -mt-2">
                <X />
              </IconButton>
            </div>
            {children && <div className="mt-5">{children}</div>}
            {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
