import { Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RouteFallback } from '@/components/motion/RouteFallback'
import { lazyWithPreload, preloadAll } from './lazy'
import { RedirectIfAuthed, RequireAuth } from './guards'
import { authPaths, routes } from './navigation'

const Register = lazyWithPreload(() => import('@/pages/Register'))
const VerifyOTP = lazyWithPreload(() => import('@/pages/VerifyOTP'))
const SetMPIN = lazyWithPreload(() => import('@/pages/SetMPIN'))
const Login = lazyWithPreload(() => import('@/pages/Login'))
const Home = lazyWithPreload(() => import('@/pages/Home'))
const Wallet = lazyWithPreload(() => import('@/pages/Wallet'))
const Schemes = lazyWithPreload(() => import('@/pages/Schemes'))
const Payments = lazyWithPreload(() => import('@/pages/Payments'))
const Activity = lazyWithPreload(() => import('@/pages/Activity'))
const Profile = lazyWithPreload(() => import('@/pages/Profile'))
const JoinScheme = lazyWithPreload(() => import('@/pages/JoinScheme'))
const SchemeDetails = lazyWithPreload(() => import('@/pages/SchemeDetails'))
const SchemeSuccessPage = lazyWithPreload(() => import('@/pages/SchemeSuccessPage'))
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))

/**
 * Two layout "groups" (auth / app). Switching between them dissolves:
 * the incoming layout (opaque, painted on top) fades in over the outgoing
 * one, which is only released once it is covered — the screen is never
 * empty, however slow the device. Routes inside a group transition via
 * their layout's own AnimatePresence.
 *
 * The group wrapper animates opacity ONLY — a transform here would turn
 * it into the containing block for the fixed bottom navigation / floating
 * action and push them off-screen during the transition.
 */
export function AppRouter() {
  const location = useLocation()
  const group = authPaths.has(location.pathname) ? 'auth' : 'app'

  // Warm all route chunks after first paint so navigation never waits on the network.
  useEffect(() => {
    preloadAll()
  }, [])

  return (
    <Suspense fallback={<RouteFallback fullScreen />}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={group}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }}
          // holds at full opacity for most of the dissolve, then drops once covered
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.9, 0, 1, 1] } }}
          className="relative z-[1] min-h-dvh"
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
                <Route path={routes.payments} element={<Payments />} />
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
