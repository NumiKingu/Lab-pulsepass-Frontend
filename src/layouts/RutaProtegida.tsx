import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { RUTAS } from '../lib/rutas'
import { Cargando } from '../componentes/Cargando'

/** Exige sesión activa; sin ella, redirige a /login guardando la ruta de origen (sección 12.3). */
export default function RutaProtegida() {
  const { sesion } = useAuth()
  const location = useLocation()

  if (sesion.estado === 'cargando') return <Cargando />
  if (sesion.estado === 'anonimo') {
    return <Navigate to={RUTAS.login} replace state={{ desde: location.pathname }} />
  }
  return <Outlet />
}
