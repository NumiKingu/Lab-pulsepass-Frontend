import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { RUTAS } from '../lib/rutas'
import { Boton } from '../componentes/Boton'

const enlacePublico = 'text-sm font-medium text-slate-700 hover:text-marca-700 dark:text-slate-300 dark:hover:text-marca-300'
const enlaceActivo = 'text-marca-700 dark:text-marca-300'

export function Navbar() {
  const { sesion, cerrarSesion, tieneRol } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const enlaces: { to: string; texto: string }[] = [
    { to: RUTAS.eventos, texto: 'Eventos' },
    { to: RUTAS.artistas, texto: 'Artistas' },
    { to: RUTAS.sedes, texto: 'Sedes' },
  ]
  if (tieneRol('STAFF', 'ADMIN')) {
    enlaces.push({ to: RUTAS.staffValidacion, texto: 'Validar ingreso' })
  }
  if (tieneRol('ADMIN')) {
    enlaces.push({ to: RUTAS.adminEventos, texto: 'Administrar eventos' })
  }

  function alCerrarSesion() {
    cerrarSesion()
    navigate(RUTAS.inicio)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <a
        href="#contenido"
        className="sr-only-focusable fixed left-2 top-2 z-50 rounded bg-marca-600 px-3 py-2 text-white"
      >
        Saltar al contenido
      </a>
      <nav aria-label="Principal" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to={RUTAS.inicio} end className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true">🎵</span> PulsePass
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              className={({ isActive }) => `${enlacePublico} ${isActive ? enlaceActivo : ''}`}
            >
              {enlace.texto}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {sesion.estado === 'autenticado' ? (
            <div className="flex items-center gap-3">
              <NavLink to={RUTAS.misTickets} className={enlacePublico}>
                Mis tickets
              </NavLink>
              <NavLink to={RUTAS.cuenta} className={enlacePublico}>
                {sesion.usuario.username}
              </NavLink>
              <Boton variante="secundario" onClick={alCerrarSesion}>
                Salir
              </Boton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to={RUTAS.login} className={enlacePublico}>
                Ingresar
              </NavLink>
              <NavLink to={RUTAS.registro}>
                <Boton>Registrarse</Boton>
              </NavLink>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </nav>

      {menuAbierto && (
        <div id="menu-movil" className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          {enlaces.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} className={enlacePublico} onClick={() => setMenuAbierto(false)}>
              {enlace.texto}
            </NavLink>
          ))}
          <hr className="border-slate-200 dark:border-slate-800" />
          {sesion.estado === 'autenticado' ? (
            <>
              <NavLink to={RUTAS.misTickets} className={enlacePublico} onClick={() => setMenuAbierto(false)}>
                Mis tickets
              </NavLink>
              <NavLink to={RUTAS.cuenta} className={enlacePublico} onClick={() => setMenuAbierto(false)}>
                Mi cuenta
              </NavLink>
              <Boton variante="secundario" onClick={alCerrarSesion}>
                Salir
              </Boton>
            </>
          ) : (
            <>
              <NavLink to={RUTAS.login} className={enlacePublico} onClick={() => setMenuAbierto(false)}>
                Ingresar
              </NavLink>
              <NavLink to={RUTAS.registro} onClick={() => setMenuAbierto(false)}>
                <Boton className="w-full">Registrarse</Boton>
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
