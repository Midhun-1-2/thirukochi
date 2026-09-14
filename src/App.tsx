import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { AppRouter } from '@/app/router'
import { AuthProvider } from '@/context/AuthContext'
import { SchemeProvider } from '@/context/SchemeContext'
import { ToastProvider } from '@/components/ui/Toast'
import { ScrollToTop } from '@/app/ScrollToTop'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <SchemeProvider>
            <ToastProvider>
              <ScrollToTop />
              <AppRouter />
            </ToastProvider>
          </SchemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
