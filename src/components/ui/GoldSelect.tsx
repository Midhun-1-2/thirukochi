import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { luxuryEase, shakeVariants } from '@/lib/motion'

/* ------------------------------------------------------------------
   GoldSelect — custom animated dropdown (listbox pattern).
   Keyboard: ↑ ↓ Home End Enter Space Esc. Type-ahead on first letter.
------------------------------------------------------------------- */

export interface SelectOption<T extends string | number = string> {
  value: T
  label: string
  description?: string
}

interface GoldSelectProps<T extends string | number> {
  label: string
  value: T | null | undefined
  options: SelectOption<T>[]
  onChange: (value: T) => void
  onBlur?: () => void
  icon?: ReactNode
  placeholder?: string
  error?: string
  name?: string
  disabled?: boolean
  className?: string
}

export function GoldSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  onBlur,
  icon,
  placeholder = 'Select',
  error,
  name,
  disabled,
  className,
}: GoldSelectProps<T>) {
  const id = useId()
  const listId = `${id}-list`
  const [open, setOpen] = useState(false)
  const selectedIndex = options.findIndex((o) => o.value === value)
  const [active, setActive] = useState(Math.max(0, selectedIndex))
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined
  const hasIcon = Boolean(icon)

  const close = useCallback(() => {
    setOpen(false)
    onBlur?.()
  }, [onBlur])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, close])

  const openList = () => {
    setActive(Math.max(0, selectedIndex))
    setOpen(true)
  }

  const commit = (index: number) => {
    const opt = options[index]
    if (!opt) return
    onChange(opt.value)
    setOpen(false)
    buttonRef.current?.focus()
    onBlur?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openList()
        else setActive((i) => Math.min(options.length - 1, i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openList()
        else setActive((i) => Math.max(0, i - 1))
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(options.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open) commit(active)
        else openList()
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          close()
        }
        break
      case 'Tab':
        if (open) close()
        break
      default: {
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const k = e.key.toLowerCase()
          const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(k))
          if (idx >= 0) {
            setActive(idx)
            if (!open) onChange(options[idx].value)
          }
        }
      }
    }
  }

  return (
    <motion.div ref={rootRef} className={cn('relative w-full', className)} variants={shakeVariants} animate={error ? 'shake' : 'idle'}>
      {name && <input type="hidden" name={name} value={value ?? ''} />}

      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${id}-label`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        onClick={() => !disabled && (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'group/select relative flex h-[58px] w-full items-center rounded-[14px] border text-left outline-none',
          'bg-[rgba(38,0,0,0.55)] transition-[border-color,box-shadow] duration-300',
          error
            ? 'border-rose/70 shadow-[0_0_0_3px_rgba(240,160,140,0.12)]'
            : open
              ? 'border-gold-bright/80 shadow-[0_0_0_3px_rgba(249,223,50,0.12),0_8px_30px_rgba(249,223,50,0.08)]'
              : 'border-[rgba(249,223,50,0.22)] hover:border-[rgba(249,223,50,0.38)] focus-visible:border-gold-bright/80',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        {hasIcon && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-[color,transform] duration-300 [&>svg]:size-[19px]',
              open ? 'text-gold-bright -translate-x-0.5' : 'text-gold-muted',
              error && 'text-rose',
            )}
          >
            {icon}
          </span>
        )}

        <span
          id={`${id}-label`}
          className={cn(
            'pointer-events-none absolute origin-left transition-[transform,top,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            hasIcon ? 'left-[46px]' : 'left-4',
            selected || open
              ? 'top-[17px] -translate-y-1/2 scale-[0.78] text-gold-muted'
              : 'top-1/2 -translate-y-1/2 text-[14.5px] text-cream-faint',
            error && 'text-rose',
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            'block w-full truncate pr-12 pt-5 pb-1 text-[15px]',
            hasIcon ? 'pl-[46px]' : 'pl-4',
            selected ? 'text-cream' : 'text-transparent',
          )}
        >
          {selected ? selected.label : placeholder}
        </span>

        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: luxuryEase }}
          className={cn('absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted', open && 'text-gold-bright')}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            aria-activedescendant={`${id}-opt-${active}`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: luxuryEase }}
            className={cn(
              'surface-glass gold-edge absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[280px] overflow-auto rounded-[16px] p-1.5',
              'origin-top shadow-luxury-lg',
            )}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value
              const isActive = i === active
              return (
                <li
                  key={String(opt.value)}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(i)}
                  className={cn(
                    'relative flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-150',
                    isActive ? 'bg-[rgba(249,223,50,0.1)]' : 'bg-transparent',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-[14px]', isSelected ? 'text-gold-bright' : 'text-cream')}>{opt.label}</span>
                    {opt.description && <span className="block text-[12px] text-cream-faint">{opt.description}</span>}
                  </span>
                  {isSelected && (
                    <motion.span
                      layoutId={`${id}-check`}
                      className="flex size-6 items-center justify-center rounded-full gold-bg text-maroon-dark"
                    >
                      <Check size={13} strokeWidth={2.6} aria-hidden />
                    </motion.span>
                  )}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 overflow-clip pl-1 text-[12.5px] text-rose"
          >
            <CircleAlert size={14} className="mt-[7px] shrink-0 self-start" aria-hidden />
            <span className="pt-1.5">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
