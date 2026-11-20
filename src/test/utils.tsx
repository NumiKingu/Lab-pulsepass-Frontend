import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import type { ReactElement, ReactNode } from 'react'
import { AuthProvider } from '../funcionalidades/auth/AuthContext'

/**
 * renderConProveedores: envuelve el componente bajo prueba con los mismos providers
 * que main.tsx (Router + TanStack Query + AuthContext), para pruebas de componentes aislados.
 */
export function renderConProveedores(
  ui: ReactElement,
  opciones: { rutaInicial?: string } & Omit<RenderOptions, 'wrapper'> = {},
) {
  const { rutaInicial = '/', ...resto } = opciones

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  function Proveedores({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[rutaInicial]}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Proveedores, ...resto })
}

export * from '@testing-library/react'
