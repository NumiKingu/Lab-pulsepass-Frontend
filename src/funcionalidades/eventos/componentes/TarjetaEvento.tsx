import { Link } from 'react-router'
import { Tarjeta } from '../../../componentes/Tarjeta'
import { BadgeEstadoEvento } from '../../../componentes/Badge'
import { RUTAS } from '../../../lib/rutas'
import { formatearFecha } from '../../../lib/formato'
import { ETIQUETA_CATEGORIA } from '../../../lib/dominio'
import type { EventSummaryResponse } from '../tipos'

const ICONO_POR_CATEGORIA: Record<EventSummaryResponse['category'], string> = {
  MUSIC: '🎵',
  SPORTS: '⚽',
  TECHNOLOGY: '💻',
  EDUCATION: '🎓',
  CULTURE: '🎭',
  ENTERTAINMENT: '🎪',
}

export function TarjetaEvento({ evento }: { evento: EventSummaryResponse }) {
  return (
    <Link to={RUTAS.evento(evento.eventCode)} className="block h-full">
      <Tarjeta className="flex h-full flex-col gap-2 transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            <span aria-hidden="true">{ICONO_POR_CATEGORIA[evento.category]}</span> {ETIQUETA_CATEGORIA[evento.category]}
          </span>
          <BadgeEstadoEvento estado={evento.status} />
        </div>
        <h3 className="text-lg font-bold">{evento.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">📅 {formatearFecha(evento.eventDate)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          📍 {evento.venueName} · {evento.venueCity}
        </p>
      </Tarjeta>
    </Link>
  )
}
