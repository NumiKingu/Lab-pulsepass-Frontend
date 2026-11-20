import { clsx } from 'clsx'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

type Tono = 'exito' | 'error' | 'info'

const CLASES_TONO: Record<Tono, string> = {
  exito: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-marca-50 text-marca-800 border-marca-100',
}

interface Props {
  tono: Tono
  children: ReactNode
  /** Si se define, el aviso se auto-cierra pasados estos milisegundos (éxito de mutación: 4 s, sección 9.20). */
  autoCerrarMs?: number
  onCerrar?: () => void
}

/** Notificación accesible: aria-live="polite" y, para errores, role="alert" (DES-10). */
export function Aviso({ tono, children, autoCerrarMs, onCerrar }: Props) {
  useEffect(() => {
    if (!autoCerrarMs || !onCerrar) return
    const id = window.setTimeout(onCerrar, autoCerrarMs)
    return () => window.clearTimeout(id)
  }, [autoCerrarMs, onCerrar])

  return (
    <div
      role={tono === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={clsx('rounded-lg border px-4 py-3 text-sm', CLASES_TONO[tono])}
    >
      {children}
    </div>
  )
}
