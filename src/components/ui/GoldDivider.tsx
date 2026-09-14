import { cn } from '@/lib/cn'

interface GoldDividerProps {
  className?: string
  /** Show a tiny diamond glyph in the centre. */
  ornament?: boolean
  vertical?: boolean
}

export function GoldDivider({ className, ornament, vertical }: GoldDividerProps) {
  if (vertical) {
    return (
      <span
        aria-hidden
        className={cn('block w-px self-stretch bg-[linear-gradient(180deg,transparent,rgba(249,223,50,0.35),transparent)]', className)}
      />
    )
  }
  return (
    <div aria-hidden className={cn('flex items-center gap-3', className)}>
      <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(249,223,50,0.38))]" />
      {ornament && (
        <span className="relative block size-2 rotate-45 border border-gold-bright/70 bg-[rgba(249,223,50,0.12)]" />
      )}
      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(249,223,50,0.38),transparent)]" />
    </div>
  )
}
