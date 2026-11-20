import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { RUTAS } from '../lib/rutas'
import { Cargando } from '../componentes/Cargando'

/** Login/Registro: si ya hay sesión activa, redirige a inicio (9.8 "Si ya hay sesión"). */
export default function SoloAnonimo() {
  const { sesion } = useAuth()

  if (sesion.estado === 'cargando') return <Cargando />
  if (sesion.estado === 'autenticado') return <Navigate to={RUTAS.inicio} replace />
  return <Outlet />
}
