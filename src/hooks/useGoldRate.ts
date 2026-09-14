import { useCallback, useEffect, useRef, useState } from 'react'
import { goldRateMockConfig, mockGoldRates } from '@/data'
import type { GoldRateData } from '@/data'
import { demo } from '@/lib/demo'

export type GoldRateStatus = 'loading' | 'ready' | 'error'

interface GoldRateState {
  status: GoldRateStatus
  data: GoldRateData | null
  /** Data was served from the session cache at mount (no fetch has completed yet). */
  fromCache: boolean
}

/**
 * Fetches today's gold rates.
 * Swap the body of `fetchRates` for a real API call; the returned
 * shape (`GoldRateData`) is the only contract the UI depends on.
 */
async function fetchRates(signal: AbortSignal): Promise<GoldRateData> {
  await new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(resolve, goldRateMockConfig.latencyMs)
    signal.addEventListener('abort', () => {
      window.clearTimeout(t)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
  if (goldRateMockConfig.simulateError || demo.rateError) throw new Error('Gold rate service unavailable')
  return mockGoldRates
}

/* Session cache (stale-while-revalidate). Returning to the dashboard
   paints the last known rates instantly instead of a loading state;
   a silent refresh runs in the background once the data is older
   than `STALE_MS`. */
const STALE_MS = 60_000
let cache: { data: GoldRateData; at: number } | null = null

export function useGoldRate() {
  const [state, setState] = useState<GoldRateState>(() =>
    cache ? { status: 'ready', data: cache.data, fromCache: true } : { status: 'loading', data: null, fromCache: false },
  )
  const controller = useRef<AbortController | null>(null)

  const run = useCallback((silent: boolean) => {
    controller.current?.abort()
    const ac = new AbortController()
    controller.current = ac
    fetchRates(ac.signal)
      .then((data) => {
        cache = { data, at: Date.now() }
        setState({ status: 'ready', data, fromCache: false })
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        // A failed background refresh keeps showing the last good rates.
        if (!silent) setState({ status: 'error', data: null, fromCache: false })
      })
  }, [])

  useEffect(() => {
    const fresh = cache && Date.now() - cache.at < STALE_MS
    if (!fresh) run(Boolean(cache))
    return () => controller.current?.abort()
  }, [run])

  const refresh = useCallback(() => {
    setState((s) => ({ status: 'loading', data: s.data, fromCache: false }))
    run(false)
  }, [run])

  return { ...state, refresh }
}
