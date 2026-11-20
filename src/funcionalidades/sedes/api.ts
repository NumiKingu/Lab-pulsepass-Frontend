import { z } from 'zod'
import { http, validar } from '../../lib/http'
import { VenueResponseSchema, type VenueResponse } from './tipos'

const VenueListSchema = z.array(VenueResponseSchema)

export const sedesApi = {
  porCodigo: async (code: string): Promise<VenueResponse> =>
    validar(VenueResponseSchema, await http.get(`/venues/${encodeURIComponent(code)}`)),

  activas: async (): Promise<VenueResponse[]> => validar(VenueListSchema, await http.get('/venues/active')),
}
