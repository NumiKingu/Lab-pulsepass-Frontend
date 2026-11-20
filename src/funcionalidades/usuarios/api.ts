import { http, validar } from '../../lib/http'
import { UserResponseSchema, type UserResponse } from './tipos'

export const usuariosApi = {
  porEmail: async (email: string): Promise<UserResponse> =>
    validar(UserResponseSchema, await http.get('/users/by-email', { email })),

  porUsername: async (username: string): Promise<UserResponse> =>
    validar(UserResponseSchema, await http.get('/users/by-username', { username })),
}
