import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PromoSlide } from '@/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { luxuryEase } from '@/lib/motion'
import { GoldButton } from '@/components/ui/GoldButton'
import { IconButton } from '@/components/ui/IconButton'
import { GoldParticles } from '@/components/motion/GoldParticles'

/* ------------------------------------------------------------------
   PromoCarousel — editorial jewellery campaign slides.
   Auto-play · pause on hover/focus · swipe · pagination · arrows.
------------------------------------------------------------------- */

interface PromoCarouselProps {
  slides: PromoSlide[]
  interval?: number
  className?: string
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.985 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.985 }),
}

export function PromoCarousel({ slides, interval = 5500, className }: PromoCarouselProps) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const timer = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback(
    (dir: number) => {
      setIndex(([i]) => [(i + dir + count) % count, dir])
    },
    [count],
  )

  const goTo = (i: number) => setIndex(([cur]) => [i, i > cur ? 1 : -1])

  useEffect(() => {
    if (paused || reduced || count < 2) return
    timer.current = window.setInterval(() => go(1), interval)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [paused, reduced, interval, go, count])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x
    const velocity = info.velocity.x
    if (swipe < -60 || velocity < -400) go(1)
    else if (swipe > 60 || velocity > 400) go(-1)
  }

  const slide = slides[index]
  if (!slide) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotions"
      className={cn('group/carousel relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="gold-edge relative overflow-clip rounded-[var(--radius-lg)] shadow-luxury">
        <div className="relative aspect-[16/10] w-full xs:aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.6/1] 2xl:aspect-[3/1]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.article
              key={slide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: luxuryEase }}
              drag={count > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={onDragEnd}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${slide.title}`}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <img
                src={slide.image}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,0,0,0.9)_0%,rgba(38,0,0,0.72)_38%,rgba(38,0,0,0.15)_72%,rgba(22,0,0,0.05)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,0,0,0)_50%,rgba(22,0,0,0.55)_100%)] sm:hidden" />

              <div className="relative flex h-full flex-col justify-end p-5 sm:justify-center sm:p-8 lg:p-10 xl:p-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="mb-2 text-[10.5px] uppercase tracking-[0.3em] text-gold-muted sm:text-[11px]"
                >
                  {slide.eyebrow}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.6, ease: luxuryEase }}
                  className="max-w-[18ch] font-display text-[clamp(24px,4.5vw,44px)] font-medium leading-[1.08] text-cream text-balance"
                >
                  {slide.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.55 }}
                  className="mt-2.5 hidden max-w-[42ch] text-[13.5px] leading-relaxed text-cream-muted xs:block sm:mt-3 sm:text-[14px]"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.5 }}
                  className="mt-4 sm:mt-6"
                >
                  <GoldButton
                    to={slide.href.startsWith('/') ? slide.href : undefined}
                    size="sm"
                    iconRight={<ArrowRight />}
                    className="sm:h-12 sm:px-6"
                  >
                    {slide.cta}
                  </GoldButton>
                </motion.div>
              </div>
            </motion.article>
          </AnimatePresence>

          <GoldParticles count={7} seed={21} opacity={0.5} size={[2, 4]} />
        </div>

        {/* arrows (md+) */}
        {count > 1 && (
          <div className="pointer-events-none absolute inset-y-0 right-4 hidden items-center gap-2 md:flex">
            <IconButton label="Previous slide" tone="outline" size="sm" className="pointer-events-auto opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100" onClick={() => go(-1)}>
              <ChevronLeft />
            </IconButton>
            <IconButton label="Next slide" tone="outline" size="sm" className="pointer-events-auto opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100" onClick={() => go(1)}>
              <ChevronRight />
            </IconButton>
          </div>
        )}
      </div>

      {/* pagination */}
      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-0" role="tablist" aria-label="Choose slide">
          {slides.map((s, i) => {
            const active = i === index
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="flex h-11 min-w-[40px] items-center justify-center px-1"
              >
                <motion.span
                  animate={{ width: active ? 28 : 8, opacity: active ? 1 : 0.45 }}
                  transition={{ duration: 0.35, ease: luxuryEase }}
                  className={cn('block h-[5px] rounded-full', active ? 'gold-bg shadow-[0_0_10px_rgba(249,223,50,0.6)]' : 'bg-gold')}
                />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
