import { clsx } from 'clsx'
import { useId, type ComponentPropsWithRef } from 'react'

interface Props extends ComponentPropsWithRef<'select'> {
  etiqueta: string
  error?: string
}

/** Select con el mismo contrato de accesibilidad que Campo; reenvía `ref` para React Hook Form. */
export function Selector({ etiqueta, error, id, className, children, ref, ...resto }: Props) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {etiqueta}
      </label>
      <select
        {...resto}
        ref={ref}
        id={idCampo}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        className={clsx(
          'min-h-11 rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600',
          'dark:bg-slate-900 dark:text-slate-100',
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700',
          className,
        )}
      >
        {children}
      </select>
      {error ? (
        <p id={idError} role="alert" className="text-xs text-red-600 dark:text-red-400">
          ⚠ {error}
        </p>
      ) : null}
    </div>
  )
}
