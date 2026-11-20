import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'
import { Boton } from '../componentes/Boton'
import { RUTAS } from '../lib/rutas'

/** errorElement del router (9.19): nunca muestra detalles internos ni stack trace. */
export default function ErrorPagina() {
  const error = useRouteError()
  const navigate = useNavigate()

  const mensaje = isRouteErrorResponse(error) ? `Error ${error.status}` : 'Algo salió mal.'

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-xl font-bold">¡Ups! {mensaje}</h1>
      <p className="text-slate-600 dark:text-slate-400">Inténtalo de nuevo en unos minutos.</p>
      <div className="flex gap-3">
        <Boton onClick={() => navigate(0)}>Reintentar</Boton>
        <Boton variante="secundario" onClick={() => navigate(RUTAS.inicio)}>
          Volver al inicio
        </Boton>
      </div>
    </div>
  )
}
