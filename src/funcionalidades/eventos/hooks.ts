import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventosApi } from './api'
import type { CreateEventRequest } from './tipos'

/** useEventosPublicados (operación #5). Catálogo público. */
export function useEventosPublicados() {
  return useQuery({
    queryKey: ['eventos', 'publicados'],
    queryFn: eventosApi.publicados,
    staleTime: 60_000,
  })
}

/** useEvento (operación #4). */
export function useEvento(eventCode: string | undefined) {
  return useQuery({
    queryKey: ['evento', eventCode],
    queryFn: () => eventosApi.porCodigo(eventCode as string),
    enabled: Boolean(eventCode),
    staleTime: 30_000,
  })
}

/** useEventosPorArtista (operación #8). */
export function useEventosPorArtista(stageName: string | undefined) {
  return useQuery({
    queryKey: ['eventos', 'artista', stageName],
    queryFn: () => eventosApi.porArtista(stageName as string),
    enabled: Boolean(stageName),
    staleTime: 60_000,
  })
}

/** useCrearEvento (operación #3, solo ADMIN). Siembra la caché con el evento recién creado. */
export function useCrearEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: CreateEventRequest) => eventosApi.crear(datos),
    onSuccess: (evento) => {
      queryClient.setQueryData(['evento', evento.eventCode], evento)
    },
  })
}

/** usePublicarEvento (operación #6, solo ADMIN). */
export function usePublicarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventCode: string) => eventosApi.publicar(eventCode),
    onSuccess: (evento) => {
      queryClient.invalidateQueries({ queryKey: ['evento', evento.eventCode] })
      queryClient.invalidateQueries({ queryKey: ['eventos', 'publicados'] })
    },
  })
}

/** useAsociarArtista (operación #7, solo ADMIN). */
export function useAsociarArtista() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventCode, artistId }: { eventCode: string; artistId: number }) =>
      eventosApi.asociarArtista(eventCode, artistId),
    onSuccess: (evento) => {
      queryClient.invalidateQueries({ queryKey: ['evento', evento.eventCode] })
      for (const artista of evento.artists) {
        queryClient.invalidateQueries({ queryKey: ['eventos', 'artista', artista.stageName] })
      }
    },
  })
}
