import { Link } from 'react-router'
import { Tarjeta } from '../../../componentes/Tarjeta'
import { BadgeEstadoTicket } from '../../../componentes/Badge'
import { Boton } from '../../../componentes/Boton'
import { PrecioCOP } from '../../../componentes/PrecioCOP'
import { RUTAS } from '../../../lib/rutas'
import { formatearFecha } from '../../../lib/formato'
import { ETIQUETA_TIPO_TICKET } from '../../../lib/dominio'
import type { TicketResponse } from '../tipos'

interface Props {
  ticket: TicketResponse
  onCancelar?: (ticket: TicketResponse) => void
}

export function TarjetaTicket({ ticket, onCancelar }: Props) {
  return (
    <Tarjeta className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold">{ticket.eventName}</h3>
        <BadgeEstadoTicket estado={ticket.status} />
      </div>
      <p className="font-mono text-sm text-slate-600 dark:text-slate-400">
        {ticket.ticketCode} · {ETIQUETA_TIPO_TICKET[ticket.type]} · <PrecioCOP valor={ticket.price} /> ·{' '}
        {formatearFecha(ticket.purchaseDate)}
      </p>
      <div className="flex justify-end gap-2">
        <Link to={RUTAS.detalleTicket(ticket.ticketCode)}>
          <Boton variante="secundario">Ver detalle</Boton>
        </Link>
        {ticket.status === 'PAID' && onCancelar && (
          <Boton variante="peligro" onClick={() => onCancelar(ticket)}>
            Cancelar
          </Boton>
        )}
      </div>
    </Tarjeta>
  )
}
