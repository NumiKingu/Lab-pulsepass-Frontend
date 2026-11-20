import { useQuery } from '@tanstack/react-query'
import { usuariosApi } from './api'

export function useUsuarioPorEmail(email: string | undefined) {
  return useQuery({
    queryKey: ['usuario', email],
    queryFn: () => usuariosApi.porEmail(email as string),
    enabled: Boolean(email),
    staleTime: 60_000,
  })
}
