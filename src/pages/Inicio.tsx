import { Link } from 'react-router'
import { Boton } from '../componentes/Boton'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { RUTAS } from '../lib/rutas'
import { useEventosPublicados } from '../funcionalidades/eventos/hooks'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { TarjetaEvento } from '../funcionalidades/eventos/componentes/TarjetaEvento'
import { TarjetaArtista } from '../funcionalidades/artistas/componentes/TarjetaArtista'
import { mensajeDeError } from '../lib/erroresUi'

export default function Inicio() {
  const eventos = useEventosPublicados()
  const artistas = useArtistasActivos()

  return (
    <div className="flex flex-col gap-12">
      <section className="-mx-4 rounded-none bg-linear-to-r from-marca-600 to-acento-500 px-4 py-16 text-white sm:mx-0 sm:rounded-2xl">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Descubre los mejores eventos</h1>
          <p className="mt-3 text-white/90">Música, cultura, deporte y tecnología en un solo lugar.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={RUTAS.eventos}>
              <Boton variante="secundario" className="w-full sm:w-auto">
                Ver cartelera
              </Boton>
            </Link>
            <Link to={RUTAS.registro}>
              <Boton className="w-full border border-white/40 bg-white/10 sm:w-auto">Crear cuenta</Boton>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Próximos eventos</h2>
        {eventos.isPending && <Cargando />}
        {eventos.isError && <EstadoError mensaje={mensajeDeError(eventos.error)} onReintentar={() => eventos.refetch()} />}
        {eventos.data && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.data.slice(0, 6).map((evento) => (
              <TarjetaEvento key={evento.eventCode} evento={evento} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Artistas destacados</h2>
        {artistas.isPending && <Cargando />}
        {artistas.data && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {artistas.data.slice(0, 4).map((artista) => (
              <TarjetaArtista key={artista.id} artista={artista} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
