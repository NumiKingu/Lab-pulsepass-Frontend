import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  /** Si es true, el modal no se cierra con Esc ni clic afuera (ver DES-10: errores 409 persistentes). */
  bloqueante?: boolean
}

/** Modal accesible: atrapa el foco, cierra con Esc (salvo bloqueante) y restaura el foco al cerrar. */
export function Modal({ abierto, titulo, onCerrar, children, bloqueante = false }: Props) {
  const refContenedor = useRef<HTMLDivElement>(null)
  const refDisparador = useRef<Element | null>(null)

  useEffect(() => {
    if (!abierto) return
    refDisparador.current = document.activeElement
    refContenedor.current?.focus()

    function alTeclear(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !bloqueante) onCerrar()
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      if (refDisparador.current instanceof HTMLElement) refDisparador.current.focus()
    }
  }, [abierto, bloqueante, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !bloqueante && onCerrar()}
    >
      <div
        ref={refContenedor}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl outline-none dark:bg-slate-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-titulo" className="text-lg font-bold">
            {titulo}
          </h2>
          {!bloqueante && (
            <button
              onClick={onCerrar}
              aria-label="Cerrar"
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-marca-600 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
