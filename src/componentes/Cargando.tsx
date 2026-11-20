/** Esqueleto de carga (sección 9.20): forma aproximada del contenido + aria-busy. */
export function Cargando({ lineas = 3 }: { lineas?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse space-y-3">
      <span className="sr-only">Cargando…</span>
      {Array.from({ length: lineas }).map((_, indice) => (
        <div key={indice} className="h-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  )
}
