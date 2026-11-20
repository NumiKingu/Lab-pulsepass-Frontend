import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

/**
 * Política de reintentos (sección 14.3 del PRD):
 * - 4xx: no se reintenta (401/403/404/409 no se arreglan solos).
 * - Red / 5xx: 1 reintento.
 * - Las mutaciones nunca se reintentan automáticamente (evita compras duplicadas).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
