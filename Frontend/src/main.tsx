import { createRoot } from 'react-dom/client'
import './index.css'
import { StrictMode } from 'react'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
