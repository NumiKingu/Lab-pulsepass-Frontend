import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { registrarManejadorNoAutorizado, registrarProveedorDeToken } from '../../lib/http'
import { authApi } from './api'
import { usuariosApi } from '../usuarios/api'
import type { Sesion } from './tipos'
import type { Rol } from '../../lib/dominio'

const CLAVE_SESSION_STORAGE = 'pulsepass.token'

interface SesionGuardada {
  token: string
  expiraEn: number // epoch ms
}

interface AuthContextValor {
  sesion: Sesion
  iniciarSesion: (identifier: string, password: string) => Promise<void>
  cerrarSesion: () => void
  tieneRol: (...roles: Rol[]) => boolean
}

const AuthContext = createContext<AuthContextValor | null>(null)

function leerSesionGuardada(): SesionGuardada | null {
  try {
    const crudo = sessionStorage.getItem(CLAVE_SESSION_STORAGE)
    if (!crudo) return null
    const datos = JSON.parse(crudo) as SesionGuardada
    if (typeof datos.token !== 'string' || typeof datos.expiraEn !== 'number') return null
    if (datos.expiraEn <= Date.now()) return null
    return datos
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  // Si no hay token guardado, el estado inicial ya es 'anonimo' (evita un setState síncrono en el efecto de abajo).
  const [sesion, setSesion] = useState<Sesion>(() => (leerSesionGuardada() ? { estado: 'cargando' } : { estado: 'anonimo' }))
  const refToken = useRef<string | null>(null)
  const refTimeoutExpiracion = useRef<number | undefined>(undefined)

  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESSION_STORAGE)
    refToken.current = null
    window.clearTimeout(refTimeoutExpiracion.current)
    queryClient.clear()
    setSesion({ estado: 'anonimo' })
  }

  function programarExpiracion(expiraEn: number) {
    window.clearTimeout(refTimeoutExpiracion.current)
    const msRestantes = expiraEn - Date.now()
    refTimeoutExpiracion.current = window.setTimeout(cerrarSesion, Math.max(msRestantes, 0))
  }

  async function establecerSesionDesdeToken(token: string, expiraEn: number) {
    refToken.current = token
    sessionStorage.setItem(CLAVE_SESSION_STORAGE, JSON.stringify({ token, expiraEn }))
    programarExpiracion(expiraEn)
    const yo = await authApi.me()
    // AuthenticatedUserResponse no trae email (confirmado contra el backend real, R-FE-002);
    // se completa con GET /api/users/by-username, necesario para comprar y para "Mis tickets" (GAP-03).
    const perfil = await usuariosApi.porUsername(yo.username)
    setSesion({
      estado: 'autenticado',
      token,
      expiraEn,
      usuario: { id: yo.id, username: yo.username, email: perfil.email, roles: yo.roles as Rol[] },
    })
  }

  async function iniciarSesion(identifier: string, password: string) {
    const respuesta = await authApi.login({ identifier, password })
    const expiraEn = Date.now() + respuesta.expiresIn * 1000
    await establecerSesionDesdeToken(respuesta.accessToken, expiraEn)
  }

  // Conecta lib/http.ts con el estado de sesión (evita un import circular http <-> AuthContext).
  useEffect(() => {
    registrarProveedorDeToken(() => refToken.current)
    registrarManejadorNoAutorizado(() => cerrarSesion())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Restaura la sesión al recargar la página (FR-FE-AUTH-004); si no hay token, el estado
  // inicial ya quedó en 'anonimo' (lazy initializer de useState) y aquí no hay nada que hacer.
  useEffect(() => {
    const guardada = leerSesionGuardada()
    if (!guardada) return
    // setState ocurre dentro del callback async al resolver la llamada a la API: es el patrón
    // sancionado de "fetch al montar" (ver cita del propio mensaje de la regla), no un setState síncrono.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    establecerSesionDesdeToken(guardada.token, guardada.expiraEn).catch(() => cerrarSesion())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const valor = useMemo<AuthContextValor>(
    () => ({
      sesion,
      iniciarSesion,
      cerrarSesion,
      tieneRol: (...roles) => sesion.estado === 'autenticado' && roles.some((r) => sesion.usuario.roles.includes(r)),
    }),
    // iniciarSesion y cerrarSesion se redefinen en cada render pero son estables en su comportamiento;
    // solo nos interesa recalcular `valor` cuando cambia la sesión.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}
