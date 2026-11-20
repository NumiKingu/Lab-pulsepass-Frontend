import { Modal } from '../../../componentes/Modal'
import { Boton } from '../../../componentes/Boton'
import { Aviso } from '../../../componentes/Aviso'
import { ETIQUETA_TIPO_TICKET, type TicketType } from '../../../lib/dominio'

interface Props {
  abierto: boolean
  nombreEvento: string
  tipo: TicketType | null
  email: string
  cargando: boolean
  error: string | null
  onCancelar: () => void
  onConfirmar: () => void
}

/** Modal de confirmación de compra (9.5): el error 409 se muestra dentro, sin cerrar el modal. */
export function ModalConfirmarCompra({
  abierto,
  nombreEvento,
  tipo,
  email,
  cargando,
  error,
  onCancelar,
  onConfirmar,
}: Props) {
  return (
    <Modal abierto={abierto} titulo="Confirmar compra" onCerrar={onCancelar} bloqueante={Boolean(error)}>
      <div className="flex flex-col gap-3 text-sm">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="font-medium text-slate-500 dark:text-slate-400">Evento:</dt>
          <dd>{nombreEvento}</dd>
          <dt className="font-medium text-slate-500 dark:text-slate-400">Tipo:</dt>
          <dd>{tipo ? ETIQUETA_TIPO_TICKET[tipo] : '—'}</dd>
          <dt className="font-medium text-slate-500 dark:text-slate-400">Cuenta:</dt>
          <dd>{email}</dd>
        </dl>
        {error && <Aviso tono="error">⚠ {error}</Aviso>}
        <div className="flex justify-end gap-2 pt-2">
          <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </Boton>
          <Boton onClick={onConfirmar} cargando={cargando}>
            Confirmar
          </Boton>
        </div>
      </div>
    </Modal>
  )
}
