import { readStorage } from '@/lib/storage'
import { authPaths, routes } from './navigation'

/* ------------------------------------------------------------------
   Pre-paint route normalisation.

   The route guards redirect *after* the first commit, which would leave
   one blank frame between the splash and the first screen (an empty
   protected layout, then the auth layout fading in). Deciding the
   landing route here — synchronously, before React renders — means the
   very first paint is already the right screen.
------------------------------------------------------------------- */

interface StoredAuth {
  account?: { phone: string } | null
  session?: { phone: string } | null
}

export function normaliseEntryRoute(): void {
  const stored = readStorage<StoredAuth | null>('tkgd.auth.v1', null)
  const authed = Boolean(stored?.session && stored?.account && stored.session.phone === stored.account.phone)
  const { pathname, search, hash } = window.location

  let target: string | null = null
  if (!authed && !authPaths.has(pathname) && pathname !== '/home' && isProtected(pathname)) {
    target = stored?.account ? routes.login : routes.register
  } else if (authed && pathname === routes.login) {
    target = routes.home
  }

  if (target && target !== pathname) window.history.replaceState(window.history.state, '', target + search + hash)
}

/** Everything under the app shell (unknown paths fall through to the 404). */
function isProtected(pathname: string): boolean {
  const known = new Set<string>([routes.home, routes.wallet, routes.schemes, routes.payments, routes.activity, routes.profile, routes.joinScheme, routes.schemeDetails, routes.schemeSuccess])
  return known.has(pathname)
}
