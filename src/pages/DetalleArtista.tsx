import { Link, useParams } from 'react-router'
import { useArtista } from '../funcionalidades/artistas/hooks'
import { useEventosPorArtista } from '../funcionalidades/eventos/hooks'
import { TarjetaEvento } from '../funcionalidades/eventos/componentes/TarjetaEvento'
import { Cargando } from '../componentes/Cargando'
import { EstadoVacio } from '../componentes/EstadoVacio'
import NoEncontrada from './NoEncontrada'
import { RUTAS } from '../lib/rutas'

export default function DetalleArtista() {
  const { id } = useParams<{ id: string }>()
  const idNumerico = Number(id)
  // id se convierte con Number(id); si es NaN, se muestra 404 de UI sin llamar a la API (9.6).
  const idValido = !Number.isNaN(idNumerico)

  const artista = useArtista(idValido ? idNumerico : undefined)
  const eventos = useEventosPorArtista(artista.data?.stageName)

  if (!idValido || artista.isError) return <NoEncontrada />

  return (
    <div className="flex flex-col gap-6">
      <Link to={RUTAS.artistas} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
        ← Artistas
      </Link>

      {artista.isPending && <Cargando lineas={2} />}

      {artista.data && (
        <>
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-marca-100 text-3xl font-bold text-marca-700 dark:bg-marca-800 dark:text-marca-100"
            >
              {artista.data.stageName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{artista.data.stageName}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {[artista.data.genre, artista.data.country].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-bold">Próximos eventos de {artista.data.stageName}</h2>
            {eventos.isPending && <Cargando />}
            {eventos.data &&
              (eventos.data.length === 0 ? (
                <EstadoVacio mensaje="Sin eventos próximos." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {eventos.data.map((evento) => (
                    <TarjetaEvento key={evento.eventCode} evento={evento} />
                  ))}
                </div>
              ))}
          </section>
        </>
      )}
    </div>
  )
}

export { DetalleArtista as Component }
