import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { normaliseEntryRoute } from '@/app/bootstrap'
import App from './App'

// Land on the right screen before the first paint (no blank redirect frame).
normaliseEntryRoute()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
