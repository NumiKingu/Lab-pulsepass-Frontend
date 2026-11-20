import { clsx } from 'clsx'
import { useId, type ComponentPropsWithRef } from 'react'

interface Props extends ComponentPropsWithRef<'input'> {
  etiqueta: string
  error?: string
  ayuda?: string
}

/**
 * Campo de texto con <label> asociado, aria-invalid y aria-describedby (FE-010).
 * Reenvía `ref` al <input> (React 19 permite declarar `ref` como prop normal,
 * sin forwardRef) para que funcione con `{...register('campo')}` de React Hook Form.
 */
export function Campo({ etiqueta, error, ayuda, id, className, ref, ...resto }: Props) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`
  const idAyuda = `${idCampo}-ayuda`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {etiqueta}
      </label>
      <input
        {...resto}
        ref={ref}
        id={idCampo}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : ayuda ? idAyuda : undefined}
        className={clsx(
          'min-h-11 rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600',
          'dark:bg-slate-900 dark:text-slate-100',
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700',
          className,
        )}
      />
      {error ? (
        <p id={idError} role="alert" className="text-xs text-red-600 dark:text-red-400">
          ⚠ {error}
        </p>
      ) : ayuda ? (
        <p id={idAyuda} className="text-xs text-slate-500 dark:text-slate-400">
          {ayuda}
        </p>
      ) : null}
    </div>
  )
}
