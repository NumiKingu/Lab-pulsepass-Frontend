import { clsx } from 'clsx'

export interface OpcionChip<T extends string> {
  valor: T
  etiqueta: string
}

interface Props<T extends string> {
  opciones: OpcionChip<T>[]
  seleccionado: T
  onSeleccionar: (valor: T) => void
}

/** Chips de filtro (DES-06): "Todos · Pagados · Usados · Cancelados" en Mis tickets. */
export function FiltroChips<T extends string>({ opciones, seleccionado, onSeleccionar }: Props<T>) {
  return (
    <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
      {opciones.map((opcion) => {
        const activo = opcion.valor === seleccionado
        return (
          <button
            key={opcion.valor}
            type="button"
            aria-pressed={activo}
            onClick={() => onSeleccionar(opcion.valor)}
            className={clsx(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              activo
                ? 'border-marca-600 bg-marca-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
            )}
          >
            {opcion.etiqueta}
          </button>
        )
      })}
    </div>
  )
}
