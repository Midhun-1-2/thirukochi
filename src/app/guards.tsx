import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { routes } from './navigation'

/* ------------------------------------------------------------------
   Route guards.

   When the session changes *while a screen is showing* (login, logout)
   the guard keeps that screen mounted for the frame in which the
   redirect is applied. Swapping the outlet for a bare <Navigate />
   would unmount the whole layout before the next route mounts — a
   hard blank flash. On a fresh load in the wrong state nothing is
   rendered, so no protected content is ever flashed.
------------------------------------------------------------------- */

/** Routes that require an authenticated session. */
export function RequireAuth() {
  const { isAuthenticated, account } = useAuth()
  const location = useLocation()
  const [authedAtMount] = useState(isAuthenticated)
  const keepScreen = isAuthenticated || authedAtMount
  return (
    <>
      {keepScreen && <Outlet />}
      {/* First-time visitors start with registration; returning members go to login. */}
      {!isAuthenticated && <Navigate to={account ? routes.login : routes.register} replace state={{ from: location.pathname }} />}
    </>
  )
}

/** Auth screens: already-logged-in members are sent to the dashboard. */
export function RedirectIfAuthed() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [authedAtMount] = useState(isAuthenticated)
  // Allow Register to be viewed even while logged in (for demos); guard Login only.
  const redirect = isAuthenticated && location.pathname === routes.login
  const keepScreen = !redirect || !authedAtMount
  return (
    <>
      {keepScreen && <Outlet />}
      {redirect && <Navigate to={routes.home} replace />}
    </>
  )
}
