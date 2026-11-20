import { z } from 'zod'
import { http, validar } from '../../lib/http'
import { ArtistResponseSchema, type ArtistResponse } from './tipos'

const ArtistListSchema = z.array(ArtistResponseSchema)

export const artistasApi = {
  porId: async (id: number): Promise<ArtistResponse> => validar(ArtistResponseSchema, await http.get(`/artists/${id}`)),

  porStageName: async (stageName: string): Promise<ArtistResponse> =>
    validar(ArtistResponseSchema, await http.get('/artists/by-stage-name', { stageName })),

  activos: async (): Promise<ArtistResponse[]> => validar(ArtistListSchema, await http.get('/artists/active')),
}
