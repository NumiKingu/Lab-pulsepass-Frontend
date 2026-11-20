import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './funcionalidades/auth/AuthContext'
import './index.css'

const elementoRaiz = document.getElementById('root')
if (!elementoRaiz) throw new Error('No se encontró el elemento #root en index.html')

createRoot(elementoRaiz).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
