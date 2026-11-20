import { z } from 'zod'
import { TicketStatusSchema, TicketTypeSchema } from '../../lib/dominio'

/** com.pulsepass.dto.response.TicketResponse */
export const TicketResponseSchema = z.object({
  id: z.number(),
  ticketCode: z.string(),
  type: TicketTypeSchema,
  price: z.number(),
  status: TicketStatusSchema,
  purchaseDate: z.string(),
  userEmail: z.email(),
  eventCode: z.string(),
  eventName: z.string(),
})
export type TicketResponse = z.infer<typeof TicketResponseSchema>

/** Formulario de compra: solo se pide el tipo; el email viene de la sesión, nunca de un campo editable. */
export const CompraSchema = z.object({
  type: TicketTypeSchema,
})
export type CompraForm = z.infer<typeof CompraSchema>

export interface PurchaseTicketRequest {
  userEmail: string
  eventCode: string
  type: z.infer<typeof TicketTypeSchema>
}
