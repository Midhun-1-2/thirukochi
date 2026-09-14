import { useCallback, useEffect, useRef, useState } from 'react'
import { goldRateMockConfig, mockGoldRates } from '@/data'
import type { GoldRateData } from '@/data'
import { demo } from '@/lib/demo'

export type GoldRateStatus = 'loading' | 'ready' | 'error'

interface GoldRateState {
  status: GoldRateStatus
  data: GoldRateData | null
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

export function useGoldRate() {
  const [state, setState] = useState<GoldRateState>({ status: 'loading', data: null })
  const controller = useRef<AbortController | null>(null)

  const run = useCallback(() => {
    controller.current?.abort()
    const ac = new AbortController()
    controller.current = ac
    fetchRates(ac.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({ status: 'error', data: null })
      })
  }, [])

  useEffect(() => {
    run()
    return () => controller.current?.abort()
  }, [run])

  const refresh = useCallback(() => {
    setState((s) => ({ status: 'loading', data: s.data }))
    run()
  }, [run])

  return { ...state, refresh }
}
