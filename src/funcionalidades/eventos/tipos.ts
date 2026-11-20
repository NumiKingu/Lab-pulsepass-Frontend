import { z } from 'zod'
import { EventCategorySchema, EventStatusSchema } from '../../lib/dominio'
import { ArtistResponseSchema } from '../artistas/tipos'

/** com.pulsepass.dto.response.EventResponse */
export const EventResponseSchema = z.object({
  id: z.number(),
  eventCode: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: EventCategorySchema,
  status: EventStatusSchema,
  eventDate: z.string(),
  minimumAge: z.number(),
  venueCode: z.string(),
  venueName: z.string(),
  artists: z.array(ArtistResponseSchema),
})
export type EventResponse = z.infer<typeof EventResponseSchema>

/** com.pulsepass.dto.response.EventSummaryResponse */
export const EventSummaryResponseSchema = z.object({
  id: z.number(),
  eventCode: z.string(),
  name: z.string(),
  category: EventCategorySchema,
  status: EventStatusSchema,
  eventDate: z.string(),
  venueName: z.string(),
  venueCity: z.string(),
})
export type EventSummaryResponse = z.infer<typeof EventSummaryResponseSchema>

/** Formulario de AdminCrearEvento, validado en el cliente antes de llegar a CreateEventRequest. */
export const CrearEventoSchema = z.object({
  eventCode: z.string().min(1, 'El código del evento es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().max(1000, 'La descripción no puede exceder 1000 caracteres').optional().or(z.literal('')),
  category: EventCategorySchema,
  eventDate: z.string().min(1, 'La fecha y hora son obligatorias'),
  minimumAge: z.number('La edad mínima es obligatoria').int('Debe ser un número entero').min(0, 'No puede ser negativo'),
  venueCode: z.string().min(1, 'Selecciona una sede'),
})
export type CrearEventoForm = z.infer<typeof CrearEventoSchema>

export interface CreateEventRequest {
  eventCode: string
  name: string
  description?: string
  category: z.infer<typeof EventCategorySchema>
  eventDate: string
  minimumAge: number
  venueCode: string
}
