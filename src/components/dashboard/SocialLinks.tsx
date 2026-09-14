import { motion } from 'framer-motion'
import type { SocialLink } from '@/data'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/icons/SocialIcons'

/* ------------------------------------------------------------------
   SocialLinks — "Follow Us" with premium circular gold-ring buttons.
------------------------------------------------------------------- */

const icons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  layout?: 'row' | 'card'
}

export function SocialLinks({ links, className, layout = 'row' }: SocialLinksProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4',
        layout === 'card' && 'surface rounded-[var(--radius-lg)] justify-between px-5 py-4',
        className,
      )}
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold-muted">Follow Us</p>
        {layout === 'card' && <p className="mt-0.5 text-[12.5px] text-cream-muted">New collections, first.</p>}
      </div>
      <ul className="flex items-center gap-2.5">
        {links.map((l) => {
          const Icon = icons[l.id]
          return (
            <li key={l.id}>
              <motion.a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.label} (opens in a new tab)`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={springSnappy}
                className={cn(
                  'group relative flex size-11 items-center justify-center rounded-full',
                  'border border-[rgba(249,223,50,0.28)] bg-[rgba(38,0,0,0.5)] text-gold-pale',
                  'transition-[color,border-color,box-shadow] duration-300',
                  'hover:border-gold-bright/80 hover:text-gold-bright hover:shadow-[0_0_0_4px_rgba(249,223,50,0.1),0_8px_22px_rgba(249,223,50,0.16)]',
                )}
              >
                <span aria-hidden className="absolute inset-[3px] rounded-full border border-[rgba(249,223,50,0.12)] transition-colors group-hover:border-[rgba(249,223,50,0.35)]" />
                <Icon size={18} />
              </motion.a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
