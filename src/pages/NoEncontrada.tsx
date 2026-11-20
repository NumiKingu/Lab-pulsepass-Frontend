import { Link } from 'react-router'
import { Boton } from '../componentes/Boton'
import { RUTAS } from '../lib/rutas'

export default function NoEncontrada() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-slate-300 dark:text-slate-700">404</h1>
      <p className="text-lg">No encontramos esta página.</p>
      <Link to={RUTAS.inicio}>
        <Boton>Volver al inicio</Boton>
      </Link>
    </div>
  )
}
