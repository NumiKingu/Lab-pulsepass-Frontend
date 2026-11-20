import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { ArtistResponse } from '../../artistas/tipos'

export function ListaArtistasEvento({ artistas }: { artistas: ArtistResponse[] }) {
  if (artistas.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Este evento aún no tiene artistas asociados.</p>
  }
  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Artistas</h2>
      <ul className="flex flex-wrap gap-2">
        {artistas.map((artista) => (
          <li key={artista.id}>
            <Link
              to={RUTAS.artista(artista.id)}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-marca-600 hover:text-marca-700 dark:border-slate-700 dark:hover:text-marca-300"
            >
              {artista.stageName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
