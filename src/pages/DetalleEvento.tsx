import { Link, useParams } from 'react-router'
import { useEvento } from '../funcionalidades/eventos/hooks'
import { useSede } from '../funcionalidades/sedes/hooks'
import { DetalleEventoCabecera } from '../funcionalidades/eventos/componentes/DetalleEventoCabecera'
import { ListaArtistasEvento } from '../funcionalidades/eventos/componentes/ListaArtistasEvento'
import { PanelCompra } from '../funcionalidades/eventos/componentes/PanelCompra'
import { TarjetaSede } from '../funcionalidades/sedes/componentes/TarjetaSede'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import { mensajeDeError } from '../lib/erroresUi'

export default function DetalleEvento() {
  const { eventCode } = useParams<{ eventCode: string }>()
  const evento = useEvento(eventCode)
  const sede = useSede(evento.data?.venueCode)

  return (
    <div className="flex flex-col gap-6">
      <Link to={RUTAS.eventos} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
        ← Volver a la cartelera
      </Link>

      {evento.isPending && <Cargando lineas={4} />}

      {evento.isError && (
        // GAP-02: un 404/403 ante un evento no publicado o inexistente se presenta igual, como "no disponible".
        <EstadoError
          mensaje={
            evento.error instanceof ApiError && (evento.error.status === 404 || evento.error.status === 403)
              ? 'Evento no disponible.'
              : mensajeDeError(evento.error)
          }
          onReintentar={() => evento.refetch()}
        />
      )}

      {evento.data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <DetalleEventoCabecera evento={evento.data} />
            <ListaArtistasEvento artistas={evento.data.artists} />
            {sede.data && (
              <div>
                <h2 className="mb-2 text-lg font-bold">Sede</h2>
                <TarjetaSede sede={sede.data} />
              </div>
            )}
          </div>
          <PanelCompra evento={evento.data} />
        </div>
      )}
    </div>
  )
}

export { DetalleEvento as Component }
