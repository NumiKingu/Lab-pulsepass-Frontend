import { useQuery } from '@tanstack/react-query'
import { artistasApi } from './api'

/** useArtista (operación #9). */
export function useArtista(id: number | undefined) {
  return useQuery({
    queryKey: ['artista', id],
    queryFn: () => artistasApi.porId(id as number),
    enabled: id !== undefined && !Number.isNaN(id),
    staleTime: 5 * 60_000,
  })
}

/** useArtistaPorNombre (operación #10). */
export function useArtistaPorNombre(stageName: string | undefined) {
  return useQuery({
    queryKey: ['artista', 'por-nombre', stageName],
    queryFn: () => artistasApi.porStageName(stageName as string),
    enabled: Boolean(stageName),
    staleTime: 5 * 60_000,
  })
}

/** useArtistasActivos (operación #11). */
export function useArtistasActivos() {
  return useQuery({
    queryKey: ['artistas', 'activos'],
    queryFn: artistasApi.activos,
    staleTime: 5 * 60_000,
  })
}
