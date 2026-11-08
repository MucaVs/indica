import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Catalog } from './components/Catalog'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Catalog />
  </StrictMode>,
)
