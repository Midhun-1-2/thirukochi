import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { luxuryEase } from '@/lib/motion'
import { RedirectIfAuthed, RequireAuth } from './guards'
import { authPaths, routes } from './navigation'

const Register = lazy(() => import('@/pages/Register'))
const VerifyOTP = lazy(() => import('@/pages/VerifyOTP'))
const SetMPIN = lazy(() => import('@/pages/SetMPIN'))
const Login = lazy(() => import('@/pages/Login'))
const Home = lazy(() => import('@/pages/Home'))
const Wallet = lazy(() => import('@/pages/Wallet'))
const Schemes = lazy(() => import('@/pages/Schemes'))
const Activity = lazy(() => import('@/pages/Activity'))
const Profile = lazy(() => import('@/pages/Profile'))
const JoinScheme = lazy(() => import('@/pages/JoinScheme'))
const SchemeDetails = lazy(() => import('@/pages/SchemeDetails'))
const SchemeSuccessPage = lazy(() => import('@/pages/SchemeSuccessPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/**
 * Two layout "groups" (auth / app). Switching between them plays a
 * cinematic cross-fade; routes inside a group transition via their
 * layout's own AnimatePresence.
 */
export function AppRouter() {
  const location = useLocation()
  const group = authPaths.has(location.pathname) ? 'auth' : 'app'

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={group}
          initial={{ opacity: 0, scale: 0.995, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.3, ease: 'easeIn' } }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="min-h-dvh"
        >
          <Routes location={location}>
            <Route element={<RedirectIfAuthed />}>
              <Route element={<AuthLayout />}>
                <Route path={routes.register} element={<Register />} />
                <Route path={routes.verifyOtp} element={<VerifyOTP />} />
                <Route path={routes.setMpin} element={<SetMPIN />} />
                <Route path={routes.login} element={<Login />} />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.wallet} element={<Wallet />} />
                <Route path={routes.schemes} element={<Schemes />} />
                <Route path={routes.activity} element={<Activity />} />
                <Route path={routes.profile} element={<Profile />} />
                <Route path={routes.joinScheme} element={<JoinScheme />} />
                <Route path={routes.schemeDetails} element={<SchemeDetails />} />
                <Route path={routes.schemeSuccess} element={<SchemeSuccessPage />} />
              </Route>
            </Route>

            <Route path="/home" element={<Navigate to={routes.home} replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  )
}

/** Gold shimmer while a route chunk loads. */
function RouteFallback() {
  return (
    <div className="bg-cinematic flex min-h-dvh items-center justify-center" role="status" aria-label="Loading">
      <span className="skeleton-gold h-1 w-40 rounded-full" />
    </div>
  )
}
