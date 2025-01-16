import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing.jsx'
import AuthProvider from '../auth/AuthProvider.jsx'
import WaitProvider from '../wait/WaitProvider.jsx'
import FightProvider from '../fight/FightProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WaitProvider>
      <FightProvider>
        <Routing/>
      </FightProvider>
      </WaitProvider>
    </AuthProvider>
  </StrictMode>,
)
