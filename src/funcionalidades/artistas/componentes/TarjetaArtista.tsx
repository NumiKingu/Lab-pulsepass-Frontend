import { Link } from 'react-router'
import { Tarjeta } from '../../../componentes/Tarjeta'
import { RUTAS } from '../../../lib/rutas'
import type { ArtistResponse } from '../tipos'

export function TarjetaArtista({ artista }: { artista: ArtistResponse }) {
  return (
    <Link to={RUTAS.artista(artista.id)} className="block">
      <Tarjeta className="flex flex-col items-center gap-2 text-center transition-shadow hover:shadow-md">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-marca-100 text-2xl font-bold text-marca-700 dark:bg-marca-800 dark:text-marca-100"
        >
          {artista.stageName.charAt(0).toUpperCase()}
        </div>
        <h3 className="font-semibold">{artista.stageName}</h3>
        {artista.genre && <p className="text-xs text-slate-500 dark:text-slate-400">{artista.genre}</p>}
      </Tarjeta>
    </Link>
  )
}
