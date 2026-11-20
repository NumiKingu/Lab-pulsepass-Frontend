import { useParams } from 'react-router'
import { useTicketsPagadosPorEvento, useUsarTicket } from '../funcionalidades/tickets/hooks'
import { Tabla, type ColumnaTabla } from '../componentes/Tabla'
import { BadgeEstadoTicket } from '../componentes/Badge'
import { PrecioCOP } from '../componentes/PrecioCOP'
import { Boton } from '../componentes/Boton'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { ETIQUETA_TIPO_TICKET } from '../lib/dominio'
import { mensajeDeError } from '../lib/erroresUi'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'

export default function TicketsPagadosEvento() {
  const { eventCode } = useParams<{ eventCode: string }>()
  const tickets = useTicketsPagadosPorEvento(eventCode)
  const usar = useUsarTicket()

  const columnas: ColumnaTabla<TicketResponse>[] = [
    { encabezado: 'Código', celda: (t) => <span className="font-mono">{t.ticketCode}</span> },
    { encabezado: 'Tipo', celda: (t) => ETIQUETA_TIPO_TICKET[t.type] },
    { encabezado: 'Titular', celda: (t) => t.userEmail },
    { encabezado: 'Precio', celda: (t) => <PrecioCOP valor={t.price} /> },
    { encabezado: 'Estado', celda: (t) => <BadgeEstadoTicket estado={t.status} /> },
    {
      encabezado: 'Acción',
      celda: (t) => (
        <Boton variante="secundario" cargando={usar.isPending} onClick={() => usar.mutate(t.ticketCode)}>
          Usar
        </Boton>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tickets pagados — {eventCode}</h1>

      {tickets.isPending && <Cargando lineas={3} />}
      {tickets.isError && <EstadoError mensaje={mensajeDeError(tickets.error)} onReintentar={() => tickets.refetch()} />}

      {tickets.data &&
        (tickets.data.length === 0 ? (
          <EstadoVacio mensaje="No hay tickets pagados." />
        ) : (
          <Tabla columnas={columnas} filas={tickets.data} obtenerClave={(t) => t.ticketCode} />
        ))}
    </div>
  )
}

export { TicketsPagadosEvento as Component }
