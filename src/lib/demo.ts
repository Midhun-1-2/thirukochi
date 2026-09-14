/**
 * Prototype-only demo switches, read once from the URL:
 *   /?demo=rate-error          → "Gold rate unavailable" state
 *   /?demo=empty-activity      → empty activity feed
 * Flags can be combined with commas. Remove this file when wiring real APIs.
 */
function readFlags(): Set<string> {
  try {
    const raw = new URLSearchParams(window.location.search).get('demo') ?? ''
    return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))
  } catch {
    return new Set()
  }
}

const flags = readFlags()

export const demo = {
  rateError: flags.has('rate-error'),
  emptyActivity: flags.has('empty-activity'),
}
