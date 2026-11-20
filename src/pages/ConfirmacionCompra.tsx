import { Link, useParams } from 'react-router'
import { useTicket } from '../funcionalidades/tickets/hooks'
import { BadgeEstadoTicket } from '../componentes/Badge'
import { PrecioCOP } from '../componentes/PrecioCOP'
import { Boton } from '../componentes/Boton'
import { Cargando } from '../componentes/Cargando'
import { RUTAS } from '../lib/rutas'
import { ETIQUETA_TIPO_TICKET } from '../lib/dominio'
import { ApiError } from '../lib/http'

export default function ConfirmacionCompra() {
  const { ticketCode } = useParams<{ ticketCode: string }>()
  const ticket = useTicket(ticketCode)

  if (ticket.isError) {
    const noDisponible = ticket.error instanceof ApiError && [403, 404].includes(ticket.error.status)
    return (
      <div className="py-12 text-center">
        <p>{noDisponible ? 'Este ticket no está disponible.' : 'Algo salió mal.'}</p>
      </div>
    )
  }

  if (ticket.isPending) return <Cargando lineas={2} />

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
      <span aria-hidden="true" className="text-5xl text-emerald-600">
        ✓
      </span>
      <h1 className="text-xl font-bold">¡Compra realizada con éxito!</h1>
      {ticket.data && (
        <p className="text-slate-600 dark:text-slate-400">
          {ticket.data.eventName}
          <br />
          Ticket <span className="font-mono">{ticket.data.ticketCode}</span> ·{' '}
          {ETIQUETA_TIPO_TICKET[ticket.data.type]} · <PrecioCOP valor={ticket.data.price} />{' '}
          <BadgeEstadoTicket estado={ticket.data.status} />
        </p>
      )}
      <div className="flex gap-3">
        <Link to={RUTAS.misTickets}>
          <Boton>Ver mis tickets</Boton>
        </Link>
        <Link to={RUTAS.eventos}>
          <Boton variante="secundario">Seguir explorando</Boton>
        </Link>
      </div>
    </div>
  )
}

export { ConfirmacionCompra as Component }
