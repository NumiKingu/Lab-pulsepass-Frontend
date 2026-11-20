import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { TarjetaArtista } from '../funcionalidades/artistas/componentes/TarjetaArtista'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { mensajeDeError } from '../lib/erroresUi'

export default function ListaArtistas() {
  const artistas = useArtistasActivos()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Artistas</h1>
      {artistas.isPending && <Cargando lineas={4} />}
      {artistas.isError && (
        <EstadoError mensaje={mensajeDeError(artistas.error)} onReintentar={() => artistas.refetch()} />
      )}
      {artistas.data &&
        (artistas.data.length === 0 ? (
          <EstadoVacio mensaje="No hay artistas activos por ahora." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {artistas.data.map((artista) => (
              <TarjetaArtista key={artista.id} artista={artista} />
            ))}
          </div>
        ))}
    </div>
  )
}

export { ListaArtistas as Component }
