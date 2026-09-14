import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { routes } from '@/app/navigation'
import { Logo } from '@/components/brand/Logo'
import { GoldRing } from '@/components/motion/GoldRing'
import { GoldButton } from '@/components/ui/GoldButton'
import { luxuryEase } from '@/lib/motion'

export default function NotFound() {
  return (
    <div className="bg-cinematic relative flex min-h-dvh items-center justify-center overflow-clip px-6 text-center">
      <GoldRing className="opacity-40" size={620} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: luxuryEase }} className="relative flex flex-col items-center">
        <Logo size="md" glow priority />
        <p className="mt-10 font-display text-[64px] font-medium leading-none gold-text lining-nums">404</p>
        <h1 className="mt-3 font-display text-[24px] font-medium text-cream">This page has wandered off</h1>
        <p className="mt-2 max-w-[34ch] text-[14px] text-cream-muted">The link may be incorrect or the page may have moved.</p>
        <GoldButton to={routes.home} className="mt-8" icon={<ArrowLeft />}>
          Back to Home
        </GoldButton>
      </motion.div>
    </div>
  )
}
