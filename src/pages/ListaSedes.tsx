import { useSedesActivas } from '../funcionalidades/sedes/hooks'
import { TarjetaSede } from '../funcionalidades/sedes/componentes/TarjetaSede'
import { Cargando } from '../componentes/Cargando'
import { EstadoError } from '../componentes/EstadoError'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { mensajeDeError } from '../lib/erroresUi'

export default function ListaSedes() {
  const sedes = useSedesActivas()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Sedes</h1>
      {sedes.isPending && <Cargando lineas={3} />}
      {sedes.isError && <EstadoError mensaje={mensajeDeError(sedes.error)} onReintentar={() => sedes.refetch()} />}
      {sedes.data &&
        (sedes.data.length === 0 ? (
          <EstadoVacio mensaje="No hay sedes activas por ahora." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sedes.data.map((sede) => (
              <TarjetaSede key={sede.code} sede={sede} />
            ))}
          </div>
        ))}
    </div>
  )
}

export { ListaSedes as Component }
