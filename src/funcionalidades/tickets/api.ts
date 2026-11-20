import { z } from 'zod'
import { http, validar } from '../../lib/http'
import { TicketResponseSchema, type TicketResponse, type PurchaseTicketRequest } from './tipos'

const TicketListSchema = z.array(TicketResponseSchema)

export const ticketsApi = {
  /** operación #15 */
  comprar: async (datos: PurchaseTicketRequest): Promise<TicketResponse> =>
    validar(TicketResponseSchema, await http.post('/tickets', datos)),

  /** operación #16 */
  porCodigo: async (ticketCode: string): Promise<TicketResponse> =>
    validar(TicketResponseSchema, await http.get(`/tickets/${encodeURIComponent(ticketCode)}`)),

  /** operación #17 — GAP-03: no existe consulta de tickets por id de usuario; se usa el email de la sesión. */
  porUsuario: async (email: string): Promise<TicketResponse[]> =>
    validar(TicketListSchema, await http.get('/tickets/by-user', { email })),

  /** operación #18 */
  pagadosPorEvento: async (eventCode: string): Promise<TicketResponse[]> =>
    validar(TicketListSchema, await http.get(`/events/${encodeURIComponent(eventCode)}/tickets/paid`)),

  /** operación #19 */
  cancelar: async (ticketCode: string): Promise<TicketResponse> =>
    validar(TicketResponseSchema, await http.patch(`/tickets/${encodeURIComponent(ticketCode)}/cancel`)),

  /** operación #20 */
  usar: async (ticketCode: string): Promise<TicketResponse> =>
    validar(TicketResponseSchema, await http.patch(`/tickets/${encodeURIComponent(ticketCode)}/use`)),
}
