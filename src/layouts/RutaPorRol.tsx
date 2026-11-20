import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { RUTAS } from '../lib/rutas'
import { Cargando } from '../componentes/Cargando'
import type { Rol } from '../lib/dominio'

/**
 * Exige uno de los roles dados (sección 12.3 del PRD, transcrito tal cual).
 * Esta guarda es solo experiencia de usuario: la seguridad real la aplica el backend;
 * un 403 del servidor siempre prevalece sobre lo que decida esta guarda.
 */
export default function RutaPorRol({ roles }: { roles: Rol[] }) {
  const { sesion } = useAuth()
  const location = useLocation()

  if (sesion.estado === 'cargando') return <Cargando />
  if (sesion.estado === 'anonimo') {
    return <Navigate to={RUTAS.login} replace state={{ desde: location.pathname }} />
  }
  if (!roles.some((r) => sesion.usuario.roles.includes(r))) {
    return <Navigate to={RUTAS.sinPermisos} replace />
  }
  return <Outlet />
}
