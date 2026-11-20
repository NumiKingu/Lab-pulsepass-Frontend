import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useEvento, usePublicarEvento, useAsociarArtista } from '../funcionalidades/eventos/hooks'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { BadgeEstadoEvento } from '../componentes/Badge'
import { Boton } from '../componentes/Boton'
import { Selector } from '../componentes/Selector'
import { Modal } from '../componentes/Modal'
import { Aviso } from '../componentes/Aviso'
import { Cargando } from '../componentes/Cargando'
import { RUTAS } from '../lib/rutas'
import { formatearFechaHora } from '../lib/formato'
import { ETIQUETA_CATEGORIA } from '../lib/dominio'
import { mensajeDeError } from '../lib/erroresUi'

export default function AdminGestionEvento() {
  const { eventCode } = useParams<{ eventCode: string }>()
  const evento = useEvento(eventCode)
  const artistasActivos = useArtistasActivos()
  const publicar = usePublicarEvento()
  const asociar = useAsociarArtista()

  const [modalPublicarAbierto, setModalPublicarAbierto] = useState(false)
  const [artistaSeleccionado, setArtistaSeleccionado] = useState('')
  const [errorAsociar, setErrorAsociar] = useState<string | null>(null)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)

  async function confirmarPublicacion() {
    if (!eventCode) return
    setErrorPublicar(null)
    try {
      await publicar.mutateAsync(eventCode)
      setModalPublicarAbierto(false)
    } catch (error) {
      setErrorPublicar(mensajeDeError(error))
    }
  }

  async function alAsociar() {
    if (!eventCode || !artistaSeleccionado) return
    setErrorAsociar(null)
    try {
      await asociar.mutateAsync({ eventCode, artistId: Number(artistaSeleccionado) })
      setArtistaSeleccionado('')
    } catch (error) {
      setErrorAsociar(mensajeDeError(error))
    }
  }

  const idsAsociados = new Set(evento.data?.artists.map((a) => a.id) ?? [])
  const artistasDisponibles = (artistasActivos.data ?? []).filter((a) => !idsAsociados.has(a.id))

  return (
    <div className="flex flex-col gap-6">
      <Link to={RUTAS.adminEventos} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
        ← Eventos
      </Link>

      {evento.isPending && <Cargando lineas={3} />}
      {evento.isError && <Aviso tono="error">{mensajeDeError(evento.error)}</Aviso>}

      {evento.data && (
        <>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">
                {evento.data.name} · <span className="font-mono text-base">{evento.data.eventCode}</span>
              </h1>
              <BadgeEstadoEvento estado={evento.data.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {ETIQUETA_CATEGORIA[evento.data.category]} · {formatearFechaHora(evento.data.eventDate)} · Mín.{' '}
              {evento.data.minimumAge} · {evento.data.venueName}
            </p>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Publicación</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              El evento es visible al público una vez publicado.
            </p>
            <Boton
              className="self-start"
              disabled={evento.data.status !== 'DRAFT'}
              onClick={() => setModalPublicarAbierto(true)}
            >
              Publicar evento
            </Boton>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Artistas asociados</h2>
            {evento.data.artists.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Ningún artista asociado todavía.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {evento.data.artists.map((artista) => (
                  <li
                    key={artista.id}
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
                  >
                    {artista.stageName}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Selector
                  etiqueta="Agregar artista"
                  value={artistaSeleccionado}
                  onChange={(e) => setArtistaSeleccionado(e.target.value)}
                >
                  <option value="">Selecciona…</option>
                  {artistasDisponibles.map((artista) => (
                    <option key={artista.id} value={artista.id}>
                      {artista.stageName}
                    </option>
                  ))}
                </Selector>
              </div>
              <Boton onClick={alAsociar} disabled={!artistaSeleccionado} cargando={asociar.isPending}>
                Asociar
              </Boton>
            </div>
            {errorAsociar && <Aviso tono="error">{errorAsociar}</Aviso>}
          </section>

          <Link
            to={RUTAS.staffTicketsPagados(evento.data.eventCode)}
            className="text-sm text-marca-700 hover:underline dark:text-marca-300"
          >
            Tickets pagados →
          </Link>
        </>
      )}

      <Modal abierto={modalPublicarAbierto} titulo="Publicar evento" onCerrar={() => setModalPublicarAbierto(false)}>
        <div className="flex flex-col gap-3">
          <p>¿Confirmas publicar este evento? Será visible para todo el público.</p>
          {errorPublicar && <Aviso tono="error">{errorPublicar}</Aviso>}
          <div className="flex justify-end gap-2">
            <Boton variante="secundario" onClick={() => setModalPublicarAbierto(false)}>
              Cancelar
            </Boton>
            <Boton onClick={confirmarPublicacion} cargando={publicar.isPending}>
              Publicar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export { AdminGestionEvento as Component }
