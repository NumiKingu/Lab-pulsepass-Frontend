import { useSearchParams } from 'react-router'
import { Campo } from '../../../componentes/Campo'
import { Selector } from '../../../componentes/Selector'
import { Boton } from '../../../componentes/Boton'
import { EventCategorySchema, ETIQUETA_CATEGORIA } from '../../../lib/dominio'
import { useArtistasActivos } from '../../artistas/hooks'

/**
 * Filtro de texto + categoría + artista que persiste en la URL (?q=&categoria=&artista=)
 * y sobrevive a recargar la página (FR-FE-EVT-002). El texto y la categoría filtran en
 * cliente; el artista cambia la fuente de datos a useEventosPorArtista (sección 9.4 del PRD).
 */
export function BarraFiltros() {
  const [parametros, setParametros] = useSearchParams()
  const q = parametros.get('q') ?? ''
  const categoria = parametros.get('categoria') ?? ''
  const artista = parametros.get('artista') ?? ''
  const { data: artistasActivos } = useArtistasActivos()

  function actualizar(clave: string, valor: string) {
    const siguientes = new URLSearchParams(parametros)
    if (valor) siguientes.set(clave, valor)
    else siguientes.delete(clave)
    setParametros(siguientes, { replace: true })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Campo
          etiqueta="Buscar por nombre"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(evento) => actualizar('q', evento.target.value)}
        />
      </div>
      <div className="sm:w-48">
        <Selector
          etiqueta="Categoría"
          value={categoria}
          onChange={(evento) => actualizar('categoria', evento.target.value)}
        >
          <option value="">Todas</option>
          {EventCategorySchema.options.map((valor) => (
            <option key={valor} value={valor}>
              {ETIQUETA_CATEGORIA[valor]}
            </option>
          ))}
        </Selector>
      </div>
      <div className="sm:w-48">
        <Selector
          etiqueta="Artista"
          value={artista}
          onChange={(evento) => actualizar('artista', evento.target.value)}
        >
          <option value="">Todos</option>
          {artistasActivos?.map((unArtista) => (
            <option key={unArtista.id} value={unArtista.stageName}>
              {unArtista.stageName}
            </option>
          ))}
        </Selector>
      </div>
      <Boton variante="secundario" onClick={() => setParametros({}, { replace: true })}>
        Limpiar
      </Boton>
    </div>
  )
}
