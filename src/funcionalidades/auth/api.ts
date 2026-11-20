import { http, validar } from '../../lib/http'
import {
  AuthResponseSchema,
  AuthenticatedUserResponseSchema,
  type AuthResponse,
  type AuthenticatedUserResponse,
  type LoginRequest,
  type RegisterUserRequest,
} from './tipos'
import { UserResponseSchema, type UserResponse } from '../usuarios/tipos'

export const authApi = {
  login: async (datos: LoginRequest): Promise<AuthResponse> =>
    validar(AuthResponseSchema, await http.post('/auth/login', datos)),

  me: async (): Promise<AuthenticatedUserResponse> =>
    validar(AuthenticatedUserResponseSchema, await http.get('/auth/me')),

  registrar: async (datos: RegisterUserRequest): Promise<UserResponse> =>
    validar(UserResponseSchema, await http.post('/users', datos)),
}
