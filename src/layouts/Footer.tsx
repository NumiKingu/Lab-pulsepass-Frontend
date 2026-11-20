import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-500 sm:flex-row dark:text-slate-400">
        <p>© 2026 PulsePass · Caso de estudio académico</p>
        <div className="flex gap-4">
          <Link to={RUTAS.sedes} className="hover:text-marca-700 dark:hover:text-marca-300">
            Sedes
          </Link>
          <Link to={RUTAS.artistas} className="hover:text-marca-700 dark:hover:text-marca-300">
            Artistas
          </Link>
        </div>
      </div>
    </footer>
  )
}
