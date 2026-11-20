import { z } from 'zod'

/** com.pulsepass.dto.response.UserResponse */
export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  active: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  city: z.string().nullable(),
  birthDate: z.string(),
})
export type UserResponse = z.infer<typeof UserResponseSchema>
