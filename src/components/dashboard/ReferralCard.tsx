import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Gift, Share2 } from 'lucide-react'
import { GoldCard } from '@/components/ui/GoldCard'
import { IconButton } from '@/components/ui/IconButton'
import { useToast } from '@/components/ui/Toast'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   ReferralCard — the member's referral code with a copy action and
   an animated gold check confirmation.
------------------------------------------------------------------- */

interface ReferralCardProps {
  code: string
  className?: string
}

export function ReferralCard({ code, className }: ReferralCardProps) {
  const { copied, copy } = useCopyToClipboard()
  const { toast } = useToast()

  const onCopy = async () => {
    if (await copy(code)) toast({ title: 'Referral code copied', description: 'Share it with friends and family.' })
  }

  const onShare = async () => {
    const text = `Join me on Thirukochi Gold & Diamonds. Use my referral code ${code}.`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Thirukochi Gold & Diamonds', text })
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy()
    }
  }

  return (
    <GoldCard variant="default" ornament className={cn('flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-[rgba(249,223,50,0.25)] bg-[rgba(249,223,50,0.06)] text-gold-bright">
            <Gift size={18} strokeWidth={1.6} aria-hidden />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-muted">Referral Code</p>
            <p className="text-[12.5px] text-cream-muted">Invite friends to Thirukochi</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-cream-muted">
        Share your code with friends and family when they join Thirukochi. Referral benefits are as per store policy.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[14px] border border-dashed border-[rgba(249,223,50,0.3)] bg-[rgba(13,0,0,0.35)] py-2.5 pl-4 pr-2">
        <span className="font-display text-[22px] font-medium tracking-[0.16em] text-gold-bright lining-nums sm:text-[24px]">{code}</span>
        <div className="ml-auto flex items-center gap-1">
          <IconButton label="Share referral code" tone="ghost" size="sm" onClick={onShare}>
            <Share2 strokeWidth={1.6} />
          </IconButton>
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? 'Referral code copied' : 'Copy referral code'}
            className={cn(
              'relative flex h-10 min-w-[84px] items-center justify-center gap-1.5 overflow-clip rounded-full px-3 text-[12.5px] font-semibold transition-colors',
              copied ? 'bg-[rgba(249,223,50,0.14)] text-gold-bright' : 'gold-bg text-maroon-dark',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="done"
                  className="flex items-center gap-1.5"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={springSnappy}
                >
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springSnappy, delay: 0.05 }}>
                    <Check size={15} strokeWidth={2.6} aria-hidden />
                  </motion.span>
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className="flex items-center gap-1.5"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={springSnappy}
                >
                  <Copy size={14} strokeWidth={2} aria-hidden />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </GoldCard>
  )
}
