import { Link, useParams } from 'react-router'
import { useSede } from '../funcionalidades/sedes/hooks'
import { Cargando } from '../componentes/Cargando'
import NoEncontrada from './NoEncontrada'
import { RUTAS } from '../lib/rutas'

export default function DetalleSede() {
  const { code } = useParams<{ code: string }>()
  const sede = useSede(code)

  if (sede.isError) return <NoEncontrada />

  return (
    <div className="flex flex-col gap-4">
      <Link to={RUTAS.sedes} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
        ← Sedes
      </Link>
      {sede.isPending && <Cargando lineas={2} />}
      {sede.data && (
        <>
          <h1 className="text-2xl font-bold">{sede.data.name}</h1>
          <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
            {sede.data.code} ·{' '}
            <span className={sede.data.active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}>
              {sede.data.active ? 'Activa' : 'Inactiva'}
            </span>
          </p>
          <p>📍 {sede.data.city}</p>
          <p>Capacidad: {sede.data.capacity} personas</p>
          {sede.data.address && <p className="text-slate-600 dark:text-slate-400">{sede.data.address}</p>}
        </>
      )}
    </div>
  )
}

export { DetalleSede as Component }
