import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Campo } from '../../../componentes/Campo'
import { Selector } from '../../../componentes/Selector'
import { Boton } from '../../../componentes/Boton'
import { Aviso } from '../../../componentes/Aviso'
import { RUTAS } from '../../../lib/rutas'
import { ApiError } from '../../../lib/http'
import { mensajeDeError } from '../../../lib/erroresUi'
import { EventCategorySchema, ETIQUETA_CATEGORIA } from '../../../lib/dominio'
import { useSedesActivas } from '../../sedes/hooks'
import { useCrearEvento } from '../../eventos/hooks'
import { CrearEventoSchema, type CrearEventoForm } from '../../eventos/tipos'
import { registrarEventoCreadoEnSesion } from '../eventosCreadosEnSesion'

export function FormularioCrearEvento() {
  const navigate = useNavigate()
  const { data: sedes, isPending: cargandoSedes } = useSedesActivas()
  const crearEvento = useCrearEvento()
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CrearEventoForm>({
    resolver: zodResolver(CrearEventoSchema),
    defaultValues: { minimumAge: 0 },
  })

  async function alEnviar(datos: CrearEventoForm) {
    setErrorGeneral(null)
    try {
      const evento = await crearEvento.mutateAsync({ ...datos, description: datos.description || undefined })
      registrarEventoCreadoEnSesion({ eventCode: evento.eventCode, name: evento.name })
      navigate(RUTAS.adminGestionEvento(evento.eventCode), { state: { creado: true } })
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && Object.keys(error.details).length > 0) {
        for (const [campo, mensaje] of Object.entries(error.details)) {
          setError(campo as keyof CrearEventoForm, { message: mensaje })
        }
        return
      }
      setErrorGeneral(mensajeDeError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)} className="flex max-w-xl flex-col gap-4" noValidate>
      <Campo etiqueta="Código del evento" placeholder="CMF-2026" error={errors.eventCode?.message} {...register('eventCode')} />
      <Campo etiqueta="Nombre" error={errors.name?.message} {...register('name')} />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Descripción
        </label>
        <textarea
          id="description"
          maxLength={1000}
          rows={4}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:bg-slate-900"
          {...register('description')}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Selector etiqueta="Categoría" error={errors.category?.message} {...register('category')}>
          <option value="">Selecciona…</option>
          {EventCategorySchema.options.map((valor) => (
            <option key={valor} value={valor}>
              {ETIQUETA_CATEGORIA[valor]}
            </option>
          ))}
        </Selector>
        <Campo
          etiqueta="Edad mínima"
          type="number"
          min={0}
          error={errors.minimumAge?.message}
          {...register('minimumAge', { valueAsNumber: true })}
        />
      </div>
      <Campo etiqueta="Fecha y hora" type="datetime-local" error={errors.eventDate?.message} {...register('eventDate')} />
      <Selector etiqueta="Sede" error={errors.venueCode?.message} {...register('venueCode')} disabled={cargandoSedes}>
        <option value="">Selecciona…</option>
        {sedes?.map((sede) => (
          <option key={sede.code} value={sede.code}>
            {sede.name} ({sede.code})
          </option>
        ))}
      </Selector>

      {errorGeneral && <Aviso tono="error">{errorGeneral}</Aviso>}

      <div className="flex justify-end gap-2">
        <Boton variante="secundario" type="button" onClick={() => navigate(RUTAS.adminEventos)}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={crearEvento.isPending}>
          Crear evento
        </Boton>
      </div>
    </form>
  )
}
