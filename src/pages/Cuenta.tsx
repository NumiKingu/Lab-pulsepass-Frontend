import { useNavigate, Link } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useUsuarioPorEmail } from '../funcionalidades/usuarios/hooks'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { BadgeRol } from '../componentes/Badge'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { RUTAS } from '../lib/rutas'
import { formatearFecha } from '../lib/formato'
import { mensajeDeError } from '../lib/erroresUi'

/** GET /api/auth/me (ya en la sesión) + GET /api/users/by-email?email= del propio usuario (FR-FE-AUTH-007). */
export default function Cuenta() {
  const { sesion, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : undefined
  const perfil = useUsuarioPorEmail(email)

  function alCerrarSesion() {
    cerrarSesion()
    navigate(RUTAS.inicio)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Mi cuenta</h1>

      {perfil.isPending && <Cargando lineas={2} />}
      {perfil.isError && <EstadoError mensaje={mensajeDeError(perfil.error)} onReintentar={() => perfil.refetch()} />}

      {perfil.data && sesion.estado === 'autenticado' && (
        <Tarjeta className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-marca-100 text-xl font-bold text-marca-700 dark:bg-marca-800 dark:text-marca-100"
            >
              {perfil.data.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-bold">
                {perfil.data.firstName} {perfil.data.lastName}{' '}
                <BadgeRol rol={sesion.usuario.roles.join(', ')} />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{perfil.data.username} · {perfil.data.email}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nacimiento: {formatearFecha(perfil.data.birthDate)} · Estado:{' '}
                {perfil.data.active ? 'Activa' : 'Inactiva'}
              </p>
            </div>
          </div>
        </Tarjeta>
      )}

      <div className="flex justify-between">
        <Link to={RUTAS.misTickets}>
          <Boton variante="secundario">Ver mis tickets</Boton>
        </Link>
        <Boton variante="peligro" onClick={alCerrarSesion}>
          Cerrar sesión
        </Boton>
      </div>
    </div>
  )
}

export { Cuenta as Component }
