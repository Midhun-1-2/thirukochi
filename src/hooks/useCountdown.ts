import { useCallback, useEffect, useState } from 'react'

/** Simple second-based countdown with restart support. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [run])

  const restart = useCallback(() => {
    setRemaining(seconds)
    setRun((n) => n + 1)
  }, [seconds])

  return { remaining, done: remaining === 0, restart }
}
