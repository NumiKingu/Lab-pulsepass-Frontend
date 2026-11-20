import { FormularioLogin } from '../funcionalidades/auth/componentes/FormularioLogin'

export default function Login() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center">
        <p className="text-2xl" aria-hidden="true">
          🎵
        </p>
        <h1 className="text-xl font-bold">Inicia sesión</h1>
      </div>
      <FormularioLogin />
    </div>
  )
}

export { Login as Component }
