import type { ReactNode } from 'react'

export interface ColumnaTabla<T> {
  encabezado: string
  celda: (fila: T) => ReactNode
}

interface Props<T> {
  columnas: ColumnaTabla<T>[]
  filas: T[]
  obtenerClave: (fila: T) => string | number
}

/**
 * Tabla genérica reutilizable (DES-07/9.15): en escritorio es una <table>;
 * en móvil (< md) se transforma en una lista de tarjetas apiladas.
 */
export function Tabla<T>({ columnas, filas, obtenerClave }: Props<T>) {
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {columnas.map((columna) => (
              <th key={columna.encabezado} className="px-3 py-2 font-semibold">
                {columna.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={obtenerClave(fila)} className="border-t border-slate-200 dark:border-slate-800">
              {columnas.map((columna) => (
                <td key={columna.encabezado} className="px-3 py-2">
                  {columna.celda(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-col gap-3 md:hidden">
        {filas.map((fila) => (
          <li
            key={obtenerClave(fila)}
            className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800"
          >
            {columnas.map((columna) => (
              <div key={columna.encabezado} className="flex justify-between gap-2 py-0.5">
                <span className="font-medium text-slate-500 dark:text-slate-400">{columna.encabezado}</span>
                <span>{columna.celda(fila)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}
