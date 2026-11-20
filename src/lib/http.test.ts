import { describe, expect, it } from 'vitest'
import { http as httpCliente, ApiError, registrarProveedorDeToken } from './http'

describe('lib/http', () => {
  it('lanza ApiError con el status y message del contrato de error en un 404', async () => {
    await expect(httpCliente.get('/events/NO-EXISTE')).rejects.toMatchObject(
      new ApiError(404, 'Evento no encontrado'),
    )
  })

  it('agrega el header Authorization cuando hay token de sesión', async () => {
    registrarProveedorDeToken(() => 'token-de-prueba')
    const yo = await httpCliente.get<{ username: string }>('/auth/me')
    expect(yo.username).toBe('andrea')
    registrarProveedorDeToken(() => null) // limpia para no afectar otras pruebas
  })

  it('responde 401 cuando no hay token (GET /auth/me sin Authorization)', async () => {
    registrarProveedorDeToken(() => null)
    await expect(httpCliente.get('/auth/me')).rejects.toMatchObject({ status: 401 })
  })
})
