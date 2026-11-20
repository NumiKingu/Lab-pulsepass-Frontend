import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'
import { useAuth } from './AuthContext'
import type { RegisterUserRequest } from './tipos'

/** useLogin (operación A1): delega en AuthContext.iniciarSesion para mantener un único origen de verdad. */
export function useLogin() {
  const { iniciarSesion } = useAuth()
  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      iniciarSesion(identifier, password),
  })
}

/** useRegistrarUsuario (operaciones #12 / A3): POST /api/users. El rol inicial siempre es USER. */
export function useRegistrarUsuario() {
  return useMutation({
    mutationFn: (datos: RegisterUserRequest) => authApi.registrar(datos),
  })
}
