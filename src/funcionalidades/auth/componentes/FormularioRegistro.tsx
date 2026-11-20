import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Campo } from '../../../componentes/Campo'
import { Boton } from '../../../componentes/Boton'
import { Aviso } from '../../../componentes/Aviso'
import { RUTAS } from '../../../lib/rutas'
import { ApiError } from '../../../lib/http'
import { useRegistrarUsuario } from '../hooks'
import { RegistroSchema, type RegistroForm } from '../tipos'

export function FormularioRegistro() {
  const navigate = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const registrar = useRegistrarUsuario()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistroForm>({ resolver: zodResolver(RegistroSchema) })

  async function alEnviar(datos: RegistroForm) {
    setErrorGeneral(null)
    try {
      await registrar.mutateAsync({
        ...datos,
        phone: datos.phone || undefined,
        city: datos.city || undefined,
      })
      navigate(RUTAS.login, { replace: true, state: { registrado: true } })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 && Object.keys(error.details).length > 0) {
          // Cada clave del backend coincide con el nombre del campo del formulario (sección 11.2).
          for (const [campo, mensaje] of Object.entries(error.details)) {
            setError(campo as keyof RegistroForm, { message: mensaje })
          }
          return
        }
        if (error.status === 409) {
          setErrorGeneral('El usuario o correo ya está registrado.')
          return
        }
      }
      setErrorGeneral('Ocurrió un error inesperado. Inténtalo más tarde.')
    }
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)} className="flex w-full max-w-md flex-col gap-4" noValidate>
      <Campo etiqueta="Nombre de usuario" error={errors.username?.message} {...register('username')} />
      <Campo etiqueta="Correo electrónico" type="email" error={errors.email?.message} {...register('email')} />
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Nombres" error={errors.firstName?.message} {...register('firstName')} />
        <Campo etiqueta="Apellidos" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Campo etiqueta="Teléfono (opcional)" error={errors.phone?.message} {...register('phone')} />
      <Campo etiqueta="Ciudad (opcional)" error={errors.city?.message} {...register('city')} />
      <Campo
        etiqueta="Fecha de nacimiento"
        type="date"
        error={errors.birthDate?.message}
        {...register('birthDate')}
      />
      <Campo
        etiqueta="Contraseña (mínimo 12 caracteres)"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {errorGeneral && <Aviso tono="error">{errorGeneral}</Aviso>}
      <Boton type="submit" cargando={registrar.isPending}>
        Crear cuenta
      </Boton>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tienes cuenta?{' '}
        <Link to={RUTAS.login} className="font-semibold text-marca-700 hover:underline dark:text-marca-300">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
