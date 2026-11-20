import { Link } from 'react-router'
import { Tarjeta } from '../../../componentes/Tarjeta'
import { RUTAS } from '../../../lib/rutas'
import type { VenueResponse } from '../tipos'

export function TarjetaSede({ sede, enlazable = true }: { sede: VenueResponse; enlazable?: boolean }) {
  const contenido = (
    <Tarjeta className={enlazable ? 'transition-shadow hover:shadow-md' : undefined}>
      <h3 className="font-bold">{sede.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        📍 {sede.city} · Capacidad {sede.capacity}
      </p>
      <span
        className={
          sede.active
            ? 'mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800'
            : 'mt-2 inline-block rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700'
        }
      >
        {sede.active ? 'Activa' : 'Inactiva'}
      </span>
    </Tarjeta>
  )
  return enlazable ? <Link to={RUTAS.sede(sede.code)}>{contenido}</Link> : contenido
}
