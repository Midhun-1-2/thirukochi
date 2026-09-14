import type { PromoSlide } from './types'

/**
 * DEMO DATA — promotional placeholders.
 * Banner artwork lives in /public/assets/banners and can be swapped
 * for client campaign creatives without touching components.
 */
export const mockPromos: PromoSlide[] = [
  {
    id: 'p1',
    eyebrow: 'The Bridal Edit',
    title: 'Celebrate Every Moment with Gold',
    subtitle: 'Heirloom craftsmanship for the days you will always remember.',
    cta: 'Explore Now',
    href: '#',
    image: '/assets/banners/banner-bridal.svg',
  },
  {
    id: 'p2',
    eyebrow: 'Diamond Atelier',
    title: 'Brilliance, Beautifully Set',
    subtitle: 'Discover contemporary diamond designs crafted with precision.',
    cta: 'Explore Now',
    href: '#',
    image: '/assets/banners/banner-diamond.svg',
  },
  {
    id: 'p3',
    eyebrow: 'Gold Savings Scheme',
    title: 'Small Steps. Big Dreams.',
    subtitle: 'Begin a monthly savings plan towards your next treasured piece.',
    cta: 'Join Scheme',
    href: '/schemes/join',
    image: '/assets/banners/banner-scheme.svg',
  },
]
