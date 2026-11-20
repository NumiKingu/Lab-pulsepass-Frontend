import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTicket, useCancelarTicket } from '../funcionalidades/tickets/hooks'
import { ModalConfirmarCancelacion } from '../funcionalidades/tickets/componentes/ModalConfirmarCancelacion'
import { BadgeEstadoTicket } from '../componentes/Badge'
import { PrecioCOP } from '../componentes/PrecioCOP'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Cargando } from '../componentes/Cargando'
import { RUTAS } from '../lib/rutas'
import { formatearFechaHora } from '../lib/formato'
import { ETIQUETA_TIPO_TICKET } from '../lib/dominio'
import { mensajeDeError } from '../lib/erroresUi'
import { ApiError } from '../lib/http'

export default function DetalleTicket() {
  const { ticketCode } = useParams<{ ticketCode: string }>()
  const ticket = useTicket(ticketCode)
  const cancelar = useCancelarTicket()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [errorCancelacion, setErrorCancelacion] = useState<string | null>(null)

  async function confirmarCancelacion() {
    setErrorCancelacion(null)
    try {
      await cancelar.mutateAsync(ticketCode as string)
      setModalAbierto(false)
    } catch (error) {
      setErrorCancelacion(mensajeDeError(error))
    }
  }

  // 403/404 (ticket ajeno o inexistente) → "Ticket no disponible", sin revelar si existe (9.12).
  if (ticket.isError) {
    const noDisponible = ticket.error instanceof ApiError && [403, 404].includes(ticket.error.status)
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-lg font-bold">{noDisponible ? 'Ticket no disponible' : 'Algo salió mal'}</p>
        <Link to={RUTAS.misTickets} className="text-marca-700 hover:underline dark:text-marca-300">
          Volver a mis tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to={RUTAS.misTickets} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
        ← Mis tickets
      </Link>

      {ticket.isPending && <Cargando lineas={2} />}

      {ticket.data && (
        <>
          <Tarjeta className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{ticket.data.eventName}</h1>
              <BadgeEstadoTicket estado={ticket.data.status} />
            </div>
            <hr className="border-slate-200 dark:border-slate-800" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="font-medium text-slate-500 dark:text-slate-400">Código</dt>
              <dd className="font-mono">{ticket.data.ticketCode}</dd>
              <dt className="font-medium text-slate-500 dark:text-slate-400">Tipo</dt>
              <dd>{ETIQUETA_TIPO_TICKET[ticket.data.type]}</dd>
              <dt className="font-medium text-slate-500 dark:text-slate-400">Precio</dt>
              <dd>
                <PrecioCOP valor={ticket.data.price} />
              </dd>
              <dt className="font-medium text-slate-500 dark:text-slate-400">Comprado el</dt>
              <dd>{formatearFechaHora(ticket.data.purchaseDate)}</dd>
            </dl>
            <p className="text-sm text-slate-500 dark:text-slate-400">Presenta este código en el ingreso.</p>
          </Tarjeta>

          {ticket.data.status === 'PAID' && (
            <div className="flex justify-end">
              <Boton variante="peligro" onClick={() => setModalAbierto(true)}>
                Cancelar ticket
              </Boton>
            </div>
          )}
        </>
      )}

      <ModalConfirmarCancelacion
        ticket={modalAbierto ? (ticket.data ?? null) : null}
        cargando={cancelar.isPending}
        error={errorCancelacion}
        onCancelar={() => {
          setModalAbierto(false)
          setErrorCancelacion(null)
        }}
        onConfirmar={confirmarCancelacion}
      />
    </div>
  )
}

export { DetalleTicket as Component }
