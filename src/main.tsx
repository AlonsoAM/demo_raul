import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import '@/lib/i18n'
import { iniciarTema } from '@/lib/tema'
import { router } from '@/app/router'

// Aplica el tema antes de montar React para evitar el parpadeo.
iniciarTema()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
