import { Link } from 'react-router'
import { FormularioCrearEvento } from '../funcionalidades/admin/componentes/FormularioCrearEvento'
import { RUTAS } from '../lib/rutas'

export default function AdminCrearEvento() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to={RUTAS.adminEventos} className="text-sm text-marca-700 hover:underline dark:text-marca-300">
          ← Eventos
        </Link>
        <h1 className="text-xl font-bold">Nuevo evento</h1>
      </div>
      <FormularioCrearEvento />
    </div>
  )
}

export { AdminCrearEvento as Component }
