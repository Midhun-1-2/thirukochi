import { useEffect, useState } from 'react'

/**
 * Detects the on-screen keyboard on mobile via the VisualViewport API.
 * Compares the visual viewport against the *current* layout viewport so
 * rotation / address-bar changes are not mistaken for a keyboard.
 */
export function useKeyboardOpen(threshold = 140): boolean {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const check = () => {
      const delta = window.innerHeight - vv.height
      setOpen(delta > threshold && vv.height < window.innerHeight * 0.75)
    }
    vv.addEventListener('resize', check)
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      vv.removeEventListener('resize', check)
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [threshold])

  return open
}
