import { FormularioRegistro } from '../funcionalidades/auth/componentes/FormularioRegistro'

export default function Registro() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h1 className="text-xl font-bold">Crea tu cuenta</h1>
      <FormularioRegistro />
    </div>
  )
}

export { Registro as Component }
