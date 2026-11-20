import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useEventosPublicados, useEventosPorArtista } from '../funcionalidades/eventos/hooks'
import { TarjetaEvento } from '../funcionalidades/eventos/componentes/TarjetaEvento'
import { BarraFiltros } from '../funcionalidades/eventos/componentes/BarraFiltros'
import { Cargando } from '../componentes/Cargando'
import { EstadoVacio } from '../componentes/EstadoVacio'
import { EstadoError } from '../componentes/EstadoError'
import { mensajeDeError } from '../lib/erroresUi'

/** FR-FE-EVT-001/002/004: cartelera con filtro de texto/categoría (cliente) y filtro por artista (API). */
export default function CatalogoEventos() {
  const [parametros] = useSearchParams()
  const q = parametros.get('q')?.toLowerCase() ?? ''
  const categoria = parametros.get('categoria') ?? ''
  const artista = parametros.get('artista') ?? ''

  const publicados = useEventosPublicados()
  const porArtista = useEventosPorArtista(artista || undefined)

  const consulta = artista ? porArtista : publicados

  const eventosFiltrados = useMemo(() => {
    const base = consulta.data ?? []
    return base.filter((evento) => {
      const coincideTexto = q ? evento.name.toLowerCase().includes(q) : true
      const coincideCategoria = categoria ? evento.category === categoria : true
      return coincideTexto && coincideCategoria
    })
  }, [consulta.data, q, categoria])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Cartelera</h1>
      <BarraFiltros />

      {consulta.isPending && <Cargando lineas={6} />}
      {consulta.isError && <EstadoError mensaje={mensajeDeError(consulta.error)} onReintentar={() => consulta.refetch()} />}

      {consulta.data && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">{eventosFiltrados.length} eventos</p>
          {eventosFiltrados.length === 0 ? (
            <EstadoVacio mensaje="Sin resultados para tu búsqueda." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventosFiltrados.map((evento) => (
                <TarjetaEvento key={evento.eventCode} evento={evento} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { CatalogoEventos as Component }
