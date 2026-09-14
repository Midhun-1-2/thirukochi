import type { GoldRateData } from './types'

/**
 * DEMO DATA — indicative placeholder values only.
 * Replace with the live rate feed. The component tree consumes
 * `GoldRateData` exactly as shaped here.
 */
export const mockGoldRates: GoldRateData = {
  date: '14/09/2026',
  updatedAt: '2026-09-14T09:30:00+05:30',
  live: true,
  isDemo: true,
  rates: [
    {
      id: '1g-22k',
      label: '1 Gram',
      weightGrams: 1,
      purity: '22K',
      price: 14125,
      change: -30,
      history: [14040, 14065, 14110, 14090, 14150, 14170, 14155, 14135, 14160, 14125],
    },
    {
      id: '8g-22k',
      label: '8 Gram',
      weightGrams: 8,
      purity: '22K',
      price: 113000,
      change: -240,
      history: [112320, 112520, 112880, 112720, 113200, 113360, 113240, 113080, 113280, 113000],
    },
    {
      id: '1g-18k',
      label: '1 Gram',
      weightGrams: 1,
      purity: '18K',
      price: 11560,
      change: 18,
      history: [11440, 11470, 11500, 11490, 11530, 11555, 11540, 11520, 11545, 11560],
    },
  ],
}

/** Simulated network characteristics for the prototype. */
export const goldRateMockConfig = {
  latencyMs: 900,
  /** Flip to `true` to preview the "Gold rate unavailable" state. */
  simulateError: false,
}
