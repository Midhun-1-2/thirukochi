import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleAlert, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

/* ------------------------------------------------------------------
   Branded toast system — maroon surface, gold edge, gold progress.
   Desktop: top-right. Mobile: bottom, above the navigation.
------------------------------------------------------------------- */

type ToastTone = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
  duration: number
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; tone?: ToastTone; duration?: number }) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), [])

  const toast = useCallback<ToastContextValue['toast']>(({ title, description, tone = 'success', duration = 3200 }) => {
    const id = ++counter.current
    setItems((list) => [...list.slice(-2), { id, title, description, tone, duration }])
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <Check size={16} strokeWidth={2.2} aria-hidden />,
  info: <Info size={16} strokeWidth={2} aria-hidden />,
  error: <CircleAlert size={16} strokeWidth={2} aria-hidden />,
}

function ToastViewport({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        'pointer-events-none fixed z-[100] flex flex-col gap-3',
        'inset-x-4 bottom-[calc(var(--bottom-nav-height)+var(--safe-bottom)+12px)] items-center',
        'lg:inset-x-auto lg:bottom-auto lg:top-6 lg:right-6 lg:items-end',
      )}
    >
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(item.duration)
  const startedAt = useRef<number>(0)
  const timer = useRef<number | null>(null)

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
  }

  const run = useCallback(() => {
    stop()
    startedAt.current = performance.now()
    timer.current = window.setTimeout(onDismiss, remaining.current)
  }, [onDismiss])

  useEffect(() => {
    if (paused) {
      stop()
      remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt.current))
    } else {
      run()
    }
    return stop
  }, [paused, run])

  return (
    <motion.div
      role="status"
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.2 } }}
      transition={springSoft}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        'pointer-events-auto surface-glass gold-edge relative w-full max-w-[380px] overflow-clip rounded-[var(--radius-md)]',
        'flex items-start gap-3 px-4 py-3.5',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
          item.tone === 'error' ? 'bg-rose/15 text-rose' : 'gold-bg text-maroon-dark',
        )}
      >
        {toneIcon[item.tone]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium leading-snug text-cream">{item.title}</p>
        {item.description && <p className="mt-0.5 text-[12px] leading-snug text-cream-muted">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-cream-faint transition-colors hover:text-cream"
      >
        <X size={14} aria-hidden />
      </button>

      {/* gold progress indicator */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[linear-gradient(90deg,#91640F,#F9DF32,#B3871C)]"
        style={{
          animation: `toast-progress ${item.duration}ms linear forwards`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      />
    </motion.div>
  )
}
