import { z } from 'zod'

/** com.pulsepass.dto.response.VenueResponse */
export const VenueResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  city: z.string(),
  address: z.string().nullable(),
  capacity: z.number(),
  active: z.boolean(),
})
export type VenueResponse = z.infer<typeof VenueResponseSchema>
