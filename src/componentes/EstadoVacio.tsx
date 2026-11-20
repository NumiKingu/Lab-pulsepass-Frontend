import type { ReactNode } from 'react'

export function EstadoVacio({ mensaje, accion }: { mensaje: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
      <span aria-hidden="true" className="text-3xl">
        🗒️
      </span>
      <p>{mensaje}</p>
      {accion}
    </div>
  )
}
