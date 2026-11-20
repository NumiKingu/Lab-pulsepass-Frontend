import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Boton } from '../../../componentes/Boton'
import { Tarjeta } from '../../../componentes/Tarjeta'
import { RUTAS } from '../../../lib/rutas'
import { mensajeDeError } from '../../../lib/erroresUi'
import { useAuth } from '../../auth/AuthContext'
import { useComprarTicket } from '../../tickets/hooks'
import { TicketTypeSchema, ETIQUETA_TIPO_TICKET, type TicketType } from '../../../lib/dominio'
import { ModalConfirmarCompra } from './ModalConfirmarCompra'
import type { EventResponse } from '../tipos'

export function PanelCompra({ evento }: { evento: EventResponse }) {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const comprar = useComprarTicket()
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TicketType>('GENERAL')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [errorCompra, setErrorCompra] = useState<string | null>(null)

  // STAFF/ADMIN no compran desde la UI (FR-SEC-TKT-01): el panel no se muestra.
  if (sesion.estado === 'autenticado' && (sesion.usuario.roles.includes('STAFF') || sesion.usuario.roles.includes('ADMIN'))) {
    return null
  }

  if (sesion.estado === 'anonimo') {
    return (
      <Tarjeta>
        <h2 className="mb-2 text-lg font-bold">Entradas</h2>
        <Link to={RUTAS.login} state={{ desde: RUTAS.evento(evento.eventCode) }}>
          <Boton className="w-full">Inicia sesión para comprar</Boton>
        </Link>
      </Tarjeta>
    )
  }

  const eventoDisponible = evento.status === 'PUBLISHED'

  async function confirmarCompra() {
    if (sesion.estado !== 'autenticado') return
    setErrorCompra(null)
    try {
      const ticket = await comprar.mutateAsync({
        userEmail: sesion.usuario.email,
        eventCode: evento.eventCode,
        type: tipoSeleccionado,
      })
      setModalAbierto(false)
      navigate(RUTAS.confirmacionCompra(ticket.ticketCode))
    } catch (error) {
      setErrorCompra(mensajeDeError(error))
    }
  }

  return (
    <Tarjeta>
      <h2 className="mb-3 text-lg font-bold">Entradas</h2>
      <fieldset className="flex flex-col gap-2" disabled={!eventoDisponible}>
        <legend className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de entrada</legend>
        {TicketTypeSchema.options.map((tipo) => (
          <label key={tipo} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="tipoTicket"
              value={tipo}
              checked={tipoSeleccionado === tipo}
              onChange={() => setTipoSeleccionado(tipo)}
              className="h-4 w-4"
            />
            {ETIQUETA_TIPO_TICKET[tipo]}
          </label>
        ))}
      </fieldset>

      <Boton className="mt-4 w-full" disabled={!eventoDisponible} onClick={() => setModalAbierto(true)}>
        {eventoDisponible ? 'Comprar entrada' : `No disponible (${evento.status})`}
      </Boton>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">El precio lo define el sistema al confirmar.</p>

      <ModalConfirmarCompra
        abierto={modalAbierto}
        nombreEvento={evento.name}
        tipo={tipoSeleccionado}
        email={sesion.estado === 'autenticado' ? sesion.usuario.email : ''}
        cargando={comprar.isPending}
        error={errorCompra}
        onCancelar={() => {
          setModalAbierto(false)
          setErrorCompra(null)
        }}
        onConfirmar={confirmarCompra}
      />
    </Tarjeta>
  )
}
