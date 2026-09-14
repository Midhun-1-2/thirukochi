import { useEffect, useState } from 'react'

/**
 * Detects the on-screen keyboard on mobile using the VisualViewport API.
 * Used to move / hide floating controls when the keyboard is up.
 */
export function useKeyboardOpen(threshold = 140): boolean {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const baseline = window.innerHeight
    const check = () => setOpen(baseline - vv.height > threshold)
    vv.addEventListener('resize', check)
    check()
    return () => vv.removeEventListener('resize', check)
  }, [threshold])

  return open
}
