import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useMisTickets, useCancelarTicket } from '../funcionalidades/tickets/hooks'
import { TarjetaTicket } from '../funcionalidades/tickets/componentes/TarjetaTicket'
import { FiltroChips } from '../funcionalidades/tickets/componentes/FiltroChips'
import { ModalConfirmarCancelacion } from '../funcionalidades/tickets/componentes/ModalConfirmarCancelacion'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { Boton } from '../componentes/Boton'
import { RUTAS } from '../lib/rutas'
import { mensajeDeError } from '../lib/erroresUi'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import type { TicketStatus } from '../lib/dominio'

type FiltroEstado = TicketStatus | 'TODOS'

export default function MisTickets() {
  const { sesion } = useAuth()
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : undefined
  const tickets = useMisTickets(email)
  const cancelar = useCancelarTicket()

  const [filtro, setFiltro] = useState<FiltroEstado>('TODOS')
  const [ticketACancelar, setTicketACancelar] = useState<TicketResponse | null>(null)
  const [errorCancelacion, setErrorCancelacion] = useState<string | null>(null)

  const ticketsFiltrados = useMemo(() => {
    const base = tickets.data ?? []
    return filtro === 'TODOS' ? base : base.filter((t) => t.status === filtro)
  }, [tickets.data, filtro])

  async function confirmarCancelacion() {
    if (!ticketACancelar) return
    setErrorCancelacion(null)
    try {
      await cancelar.mutateAsync(ticketACancelar.ticketCode)
      setTicketACancelar(null)
    } catch (error) {
      // 409 ("ticket usado / no cancelable") se muestra dentro del modal, sin cerrarlo (9.11).
      setErrorCancelacion(mensajeDeError(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Mis tickets</h1>

      <FiltroChips
        seleccionado={filtro}
        onSeleccionar={setFiltro}
        opciones={[
          { valor: 'TODOS', etiqueta: 'Todos' },
          { valor: 'PAID', etiqueta: 'Pagados' },
          { valor: 'USED', etiqueta: 'Usados' },
          { valor: 'CANCELLED', etiqueta: 'Cancelados' },
        ]}
      />

      {tickets.isPending && <Cargando lineas={3} />}
      {tickets.isError && <EstadoError mensaje={mensajeDeError(tickets.error)} onReintentar={() => tickets.refetch()} />}

      {tickets.data &&
        (ticketsFiltrados.length === 0 ? (
          <EstadoVacio
            mensaje="Aún no tienes tickets."
            accion={
              <Link to={RUTAS.eventos}>
                <Boton variante="secundario">Ver cartelera</Boton>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {ticketsFiltrados.map((ticket) => (
              <TarjetaTicket
                key={ticket.ticketCode}
                ticket={ticket}
                onCancelar={(t) => {
                  setErrorCancelacion(null)
                  setTicketACancelar(t)
                }}
              />
            ))}
          </div>
        ))}

      <ModalConfirmarCancelacion
        ticket={ticketACancelar}
        cargando={cancelar.isPending}
        error={errorCancelacion}
        onCancelar={() => {
          setTicketACancelar(null)
          setErrorCancelacion(null)
        }}
        onConfirmar={confirmarCancelacion}
      />
    </div>
  )
}

export { MisTickets as Component }
