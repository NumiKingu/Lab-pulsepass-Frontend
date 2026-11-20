import { Modal } from '../../../componentes/Modal'
import { Boton } from '../../../componentes/Boton'
import { Aviso } from '../../../componentes/Aviso'
import type { TicketResponse } from '../tipos'

interface Props {
  ticket: TicketResponse | null
  cargando: boolean
  error: string | null
  onCancelar: () => void
  onConfirmar: () => void
}

export function ModalConfirmarCancelacion({ ticket, cargando, error, onCancelar, onConfirmar }: Props) {
  return (
    <Modal abierto={ticket !== null} titulo="Cancelar ticket" onCerrar={onCancelar} bloqueante={Boolean(error)}>
      {ticket && (
        <div className="flex flex-col gap-3">
          <p>
            ¿Confirmas cancelar el ticket <span className="font-mono">{ticket.ticketCode}</span> para{' '}
            <strong>{ticket.eventName}</strong>?
          </p>
          {error && <Aviso tono="error">{error}</Aviso>}
          <div className="flex justify-end gap-2">
            <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
              Volver
            </Boton>
            <Boton variante="peligro" onClick={onConfirmar} cargando={cargando}>
              Confirmar cancelación
            </Boton>
          </div>
        </div>
      )}
    </Modal>
  )
}
