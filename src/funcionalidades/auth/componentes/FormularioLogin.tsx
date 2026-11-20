import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Campo } from '../../../componentes/Campo'
import { Boton } from '../../../componentes/Boton'
import { Aviso } from '../../../componentes/Aviso'
import { RUTAS } from '../../../lib/rutas'
import { mensajeDeError } from '../../../lib/erroresUi'
import { useLogin } from '../hooks'
import { LoginRequestSchema, type LoginRequest } from '../tipos'

interface EstadoNavegacion {
  desde?: string
  registrado?: boolean
}

export function FormularioLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const estadoNavegacion = (location.state as EstadoNavegacion | null) ?? null
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({ resolver: zodResolver(LoginRequestSchema) })

  async function alEnviar(datos: LoginRequest) {
    setErrorGeneral(null)
    try {
      await login.mutateAsync(datos)
      navigate(estadoNavegacion?.desde ?? RUTAS.inicio, { replace: true })
    } catch (error) {
      // 401 en login siempre es un mensaje genérico (nunca distingue usuario inexistente de contraseña incorrecta).
      setErrorGeneral(mensajeDeError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      {estadoNavegacion?.registrado && (
        <Aviso tono="exito">Cuenta creada, inicia sesión.</Aviso>
      )}
      <Campo
        etiqueta="Usuario o correo"
        autoComplete="username"
        error={errors.identifier?.message}
        {...register('identifier')}
      />
      <Campo
        etiqueta="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {errorGeneral && <Aviso tono="error">{errorGeneral}</Aviso>}
      <Boton type="submit" cargando={login.isPending}>
        Ingresar
      </Boton>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link to={RUTAS.registro} className="font-semibold text-marca-700 hover:underline dark:text-marca-300">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
