import { useId, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { mulberry32 } from '@/lib/random'
import { luxuryEase } from '@/lib/motion'

/* ------------------------------------------------------------------
   Captcha — a simple numeric challenge rendered as gold SVG type
   with faint engraving lines. Fits the luxury system; never looks
   like a 2005 web form.
------------------------------------------------------------------- */

interface CaptchaProps {
  code: string
  onRefresh: () => void
  className?: string
}

export function Captcha({ code, onRefresh, className }: CaptchaProps) {
  const id = useId().replace(/:/g, '')
  const [spins, setSpins] = useState(0)

  // Deterministic decoration for a given code
  const deco = useMemo(() => {
    const seed = Number.parseInt(code, 10) || 1
    const rand = mulberry32(seed)
    const glyphs = code.split('').map((ch, i) => ({
      ch,
      x: 22 + i * 30 + (rand() - 0.5) * 6,
      y: 40 + (rand() - 0.5) * 8,
      rotate: (rand() - 0.5) * 24,
      size: 28 + rand() * 6,
    }))
    const lines = Array.from({ length: 3 }, () => ({
      x1: rand() * 20,
      y1: 10 + rand() * 40,
      x2: 120 + rand() * 30,
      y2: 10 + rand() * 40,
      o: 0.25 + rand() * 0.3,
    }))
    const dots = Array.from({ length: 14 }, () => ({ x: rand() * 150, y: rand() * 60, r: 0.6 + rand() * 1.1, o: 0.2 + rand() * 0.5 }))
    return { glyphs, lines, dots }
  }, [code])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="img"
        aria-label={`Captcha code: ${code.split('').join(' ')}`}
        className="gold-edge relative flex h-[58px] flex-1 items-center justify-center overflow-clip rounded-[14px] bg-[linear-gradient(180deg,rgba(13,0,0,0.7),rgba(38,0,0,0.75))]"
      >
        <motion.svg
          key={code}
          viewBox="0 0 150 60"
          className="h-full w-[150px]"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: luxuryEase }}
        >
          <defs>
            <linearGradient id={`${id}-cg`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#B3871C" />
              <stop offset="0.45" stopColor="#F9DF32" />
              <stop offset="0.6" stopColor="#FFF3B0" />
              <stop offset="1" stopColor="#91640F" />
            </linearGradient>
          </defs>
          {deco.lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#F9DF32" strokeWidth="0.7" opacity={l.o} />
          ))}
          {deco.dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#F9DF32" opacity={d.o} />
          ))}
          {deco.glyphs.map((g, i) => (
            <text
              key={i}
              x={g.x}
              y={g.y}
              fontFamily="'Playfair Display Variable', 'Playfair Display', Georgia, serif"
              fontWeight="600"
              fontSize={g.size}
              fill={`url(#${id}-cg)`}
              textAnchor="middle"
              transform={`rotate(${g.rotate} ${g.x} ${g.y})`}
              style={{ fontVariantNumeric: 'lining-nums' }}
            >
              {g.ch}
            </text>
          ))}
        </motion.svg>
      </div>

      <motion.button
        type="button"
        aria-label="Refresh captcha"
        title="Refresh captcha"
        onClick={() => {
          setSpins((s) => s + 1)
          onRefresh()
        }}
        whileTap={{ scale: 0.9 }}
        className="flex size-[58px] shrink-0 items-center justify-center rounded-[14px] border border-[rgba(249,223,50,0.22)] bg-[rgba(38,0,0,0.55)] text-gold-muted transition-colors hover:border-[rgba(249,223,50,0.45)] hover:text-gold-bright"
      >
        <motion.span animate={{ rotate: spins * 360 }} transition={{ duration: 0.6, ease: luxuryEase }} className="flex">
          <RefreshCw size={19} strokeWidth={1.7} aria-hidden />
        </motion.span>
      </motion.button>
    </div>
  )
}
