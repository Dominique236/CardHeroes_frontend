import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing.jsx'
import AuthProvider from '../auth/AuthProvider.jsx'
import WaitProvider from '../wait/WaitProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WaitProvider>
        <Routing/>
      </WaitProvider>
    </AuthProvider>
  </StrictMode>,
)
