import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma'

const CLASES_VARIANTE: Record<Variante, string> = {
  primario: 'bg-marca-600 text-white hover:bg-marca-700 focus-visible:outline-marca-600',
  secundario:
    'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus-visible:outline-marca-600 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
  peligro: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  fantasma:
    'bg-transparent text-marca-700 hover:bg-marca-50 focus-visible:outline-marca-600 dark:text-marca-300 dark:hover:bg-slate-800',
}

interface Props extends ComponentProps<'button'> {
  variante?: Variante
  cargando?: boolean
}

export function Boton({ variante = 'primario', cargando = false, className, children, disabled, ...resto }: Props) {
  return (
    <button
      {...resto}
      disabled={disabled ?? cargando}
      aria-busy={cargando}
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        CLASES_VARIANTE[variante],
        className,
      )}
    >
      {cargando ? 'Cargando…' : children}
    </button>
  )
}
