import { z } from 'zod'
import { http, validar } from '../../lib/http'
import {
  EventResponseSchema,
  EventSummaryResponseSchema,
  type EventResponse,
  type EventSummaryResponse,
  type CreateEventRequest,
} from './tipos'

const EventSummaryListSchema = z.array(EventSummaryResponseSchema)

export const eventosApi = {
  /** operación #3 */
  crear: async (datos: CreateEventRequest): Promise<EventResponse> =>
    validar(EventResponseSchema, await http.post('/events', datos)),

  /** operación #4 */
  porCodigo: async (eventCode: string): Promise<EventResponse> =>
    validar(EventResponseSchema, await http.get(`/events/${encodeURIComponent(eventCode)}`)),

  /** operación #5 */
  publicados: async (): Promise<EventSummaryResponse[]> =>
    validar(EventSummaryListSchema, await http.get('/events/published')),

  /** operación #6 */
  publicar: async (eventCode: string): Promise<EventResponse> =>
    validar(EventResponseSchema, await http.patch(`/events/${encodeURIComponent(eventCode)}/publish`)),

  /** operación #7 */
  asociarArtista: async (eventCode: string, artistId: number): Promise<EventResponse> =>
    validar(EventResponseSchema, await http.post(`/events/${encodeURIComponent(eventCode)}/artists/${artistId}`)),

  /** operación #8 */
  porArtista: async (stageName: string): Promise<EventSummaryResponse[]> =>
    validar(EventSummaryListSchema, await http.get('/events/by-artist', { stageName })),
}
