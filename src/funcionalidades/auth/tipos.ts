import { z } from 'zod'
import { RolSchema } from '../../lib/dominio'

export const LoginRequestSchema = z.object({
  identifier: z.string().min(1, 'Ingresa tu usuario o correo'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

/** Respuesta de POST /api/auth/login (com.pulsepass.dto.response.AuthResponse). */
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.number(),
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

/** Respuesta de GET /api/auth/me (com.pulsepass.dto.response.AuthenticatedUserResponse). */
export const AuthenticatedUserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  roles: z.array(z.string()),
})
export type AuthenticatedUserResponse = z.infer<typeof AuthenticatedUserResponseSchema>

/**
 * Formulario de registro. Límites del backend (RegisterUserRequest):
 * password entre 12 y 72 caracteres (y ≤ 72 bytes UTF-8, BCrypt).
 */
export const RegistroSchema = z
  .object({
    username: z.string().min(1, 'El usuario es obligatorio').max(80),
    email: z.email('El correo no es válido').max(255),
    firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
    lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
    phone: z.string().max(30).optional().or(z.literal('')),
    city: z.string().max(100).optional().or(z.literal('')),
    birthDate: z
      .string()
      .min(1, 'La fecha de nacimiento es obligatoria')
      .refine((valor) => new Date(valor).getTime() <= Date.now(), 'La fecha no puede ser futura'),
    password: z
      .string()
      .min(12, 'La contraseña debe tener al menos 12 caracteres')
      .max(72, 'La contraseña no puede exceder 72 caracteres')
      .refine((valor) => new TextEncoder().encode(valor).length <= 72, 'La contraseña excede el límite de 72 bytes'),
  })
export type RegistroForm = z.infer<typeof RegistroSchema>

export interface RegisterUserRequest {
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  city?: string
  birthDate: string
  password: string
}

/**
 * Unión discriminada del estado de sesión (sección 12.1).
 *
 * Nota (riesgo R-FE-002 del PRD, confirmado contra el backend real):
 * AuthenticatedUserResponse (GET /api/auth/me) solo trae { id, username, roles } — NO email.
 * Como la compra de tickets y "Mis tickets" necesitan el email (GAP-03), AuthContext completa
 * el email con una llamada adicional a GET /api/users/by-username justo después de /auth/me.
 */
export type Sesion =
  | { estado: 'cargando' }
  | { estado: 'anonimo' }
  | {
      estado: 'autenticado'
      token: string
      expiraEn: number
      usuario: { id: number; username: string; email: string; roles: z.infer<typeof RolSchema>[] }
    }
