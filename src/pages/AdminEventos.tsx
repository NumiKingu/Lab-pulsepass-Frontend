import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Campo } from '../componentes/Campo'
import { Boton } from '../componentes/Boton'
import { Aviso } from '../componentes/Aviso'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { RUTAS } from '../lib/rutas'
import { leerEventosCreadosEnSesion } from '../funcionalidades/admin/eventosCreadosEnSesion'

export default function AdminEventos() {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  // Lectura única al montar (lazy initializer): sessionStorage no cambia fuera de esta pestaña.
  const [creados] = useState(() => leerEventosCreadosEnSesion())

  function alAbrir(evento: React.FormEvent) {
    evento.preventDefault()
    if (codigo.trim()) navigate(RUTAS.adminGestionEvento(codigo.trim()))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administración de eventos</h1>
        <Link to={RUTAS.adminCrearEvento}>
          <Boton>+ Nuevo evento</Boton>
        </Link>
      </div>

      <form onSubmit={alAbrir} className="flex items-end gap-3">
        <div className="flex-1">
          <Campo
            etiqueta="Buscar evento por código"
            placeholder="CMF-2026"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>
        <Boton type="submit">Abrir</Boton>
      </form>

      <div>
        <h2 className="mb-2 text-lg font-bold">Creados en esta sesión</h2>
        {creados.length === 0 ? (
          <EstadoVacio mensaje="Aún no has creado eventos en esta sesión." />
        ) : (
          <ul className="flex flex-col gap-2">
            {creados.map((evento) => (
              <li key={evento.eventCode}>
                <Link
                  to={RUTAS.adminGestionEvento(evento.eventCode)}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-marca-600 dark:border-slate-800"
                >
                  <span>
                    <span className="font-mono text-sm">{evento.eventCode}</span> · {evento.name}
                  </span>
                  <span className="text-marca-700 dark:text-marca-300">Gestionar</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Aviso tono="info" >
          Nota: la API no ofrece un listado completo de eventos (GAP-01).
        </Aviso>
      </div>
    </div>
  )
}

export { AdminEventos as Component }
