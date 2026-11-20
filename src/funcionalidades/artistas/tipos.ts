import { z } from 'zod'

/** com.pulsepass.dto.response.ArtistResponse */
export const ArtistResponseSchema = z.object({
  id: z.number(),
  stageName: z.string(),
  country: z.string().nullable(),
  genre: z.string().nullable(),
  active: z.boolean(),
})
export type ArtistResponse = z.infer<typeof ArtistResponseSchema>
