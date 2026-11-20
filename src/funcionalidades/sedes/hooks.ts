import { useQuery } from '@tanstack/react-query'
import { sedesApi } from './api'

/** useSede (operación #1). */
export function useSede(code: string | undefined) {
  return useQuery({
    queryKey: ['sede', code],
    queryFn: () => sedesApi.porCodigo(code as string),
    enabled: Boolean(code),
    staleTime: 5 * 60_000,
  })
}

/** useSedesActivas (operación #2). */
export function useSedesActivas() {
  return useQuery({
    queryKey: ['sedes', 'activas'],
    queryFn: sedesApi.activas,
    staleTime: 5 * 60_000,
  })
}
