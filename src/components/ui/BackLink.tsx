import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

interface BackLinkProps {
  to?: string
  label?: string
  className?: string
}

/** Back navigation — uses history when possible, falls back to `to`. */
export function BackLink({ to, label = 'Back', className }: BackLinkProps) {
  const navigate = useNavigate()
  const classes = cn(
    'group inline-flex h-10 items-center gap-2 rounded-full pr-3 text-[13px] text-gold-muted transition-colors hover:text-gold-bright',
    className,
  )
  const inner = (
    <>
      <span className="flex size-8 items-center justify-center rounded-full border border-[rgba(249,223,50,0.22)] bg-[rgba(38,0,0,0.4)] transition-colors group-hover:border-gold-bright/60">
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
      </span>
      {label}
    </>
  )

  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="inline-block">
      {to ? (
        <Link to={to} className={classes}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={() => navigate(-1)} className={classes}>
          {inner}
        </button>
      )}
    </motion.div>
  )
}
