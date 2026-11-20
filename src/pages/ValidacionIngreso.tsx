import { useRef, useState } from 'react'
import { useTicket, useUsarTicket } from '../funcionalidades/tickets/hooks'
import { BadgeEstadoTicket } from '../componentes/Badge'
import { Campo } from '../componentes/Campo'
import { Boton } from '../componentes/Boton'
import { Aviso } from '../componentes/Aviso'
import { Tarjeta } from '../componentes/Tarjeta'
import { Cargando } from '../componentes/Cargando'
import { ETIQUETA_TIPO_TICKET } from '../lib/dominio'
import { ApiError } from '../lib/http'
import { mensajeDeError } from '../lib/erroresUi'

/** STAFF — Validación de ingreso (9.14): consulta bajo demanda + marcar como usado. */
export default function ValidacionIngreso() {
  const [codigoBuscado, setCodigoBuscado] = useState<string | undefined>(undefined)
  const [valorCampo, setValorCampo] = useState('')
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
  const refInput = useRef<HTMLInputElement>(null)

  const ticket = useTicket(codigoBuscado)
  const usar = useUsarTicket()

  function alBuscar(evento: React.FormEvent) {
    evento.preventDefault()
    setMensajeExito(null)
    if (valorCampo.trim()) setCodigoBuscado(valorCampo.trim())
  }

  async function alMarcarUsado() {
    if (!codigoBuscado) return
    setMensajeExito(null)
    try {
      await usar.mutateAsync(codigoBuscado)
      setMensajeExito('Ingreso registrado.')
      setValorCampo('')
      setCodigoBuscado(undefined)
      refInput.current?.focus()
    } catch {
      // El error (p. ej. 409 "ya fue utilizado") se muestra abajo con el estado actual del ticket.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Validación de ingreso</h1>

      <form onSubmit={alBuscar} className="flex items-end gap-3">
        <div className="flex-1">
          <Campo
            etiqueta="Código de ticket"
            ref={refInput}
            autoFocus
            value={valorCampo}
            onChange={(e) => setValorCampo(e.target.value)}
          />
        </div>
        <Boton type="submit">Buscar</Boton>
      </form>

      {ticket.isFetching && <Cargando lineas={1} />}

      {ticket.isError && (
        <Aviso tono="error">
          {ticket.error instanceof ApiError && ticket.error.status === 404
            ? 'Ticket no encontrado.'
            : mensajeDeError(ticket.error)}
        </Aviso>
      )}

      {ticket.data && (
        <Tarjeta className="flex flex-col gap-3 text-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold">{ticket.data.eventName}</span>
            <BadgeEstadoTicket estado={ticket.data.status} />
          </div>
          <p>
            {ETIQUETA_TIPO_TICKET[ticket.data.type]} · Titular: {ticket.data.userEmail}
          </p>
          {ticket.data.status === 'PAID' && (
            <Boton onClick={alMarcarUsado} cargando={usar.isPending} className="self-start">
              Marcar como usado
            </Boton>
          )}
          {usar.isError && (
            <Aviso tono="error">⚠ {mensajeDeError(usar.error)}</Aviso>
          )}
          {mensajeExito && (
            <Aviso tono="exito" autoCerrarMs={4000} onCerrar={() => setMensajeExito(null)}>
              ✓ {mensajeExito}
            </Aviso>
          )}
        </Tarjeta>
      )}
    </div>
  )
}

export { ValidacionIngreso as Component }
