import { BadgeEstadoEvento } from '../../../componentes/Badge'
import { formatearFechaHora } from '../../../lib/formato'
import { ETIQUETA_CATEGORIA } from '../../../lib/dominio'
import type { EventResponse } from '../tipos'

export function DetalleEventoCabecera({ evento }: { evento: EventResponse }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
        <span>{ETIQUETA_CATEGORIA[evento.category]}</span>
        <BadgeEstadoEvento estado={evento.status} />
      </div>
      <h1 className="text-2xl font-bold">{evento.name}</h1>
      <p className="text-slate-600 dark:text-slate-400">📅 {formatearFechaHora(evento.eventDate)}</p>
      <p className="text-slate-600 dark:text-slate-400">🔞 Edad mínima: {evento.minimumAge}</p>
      {evento.description && <p className="mt-2 whitespace-pre-line">{evento.description}</p>}
    </div>
  )
}
