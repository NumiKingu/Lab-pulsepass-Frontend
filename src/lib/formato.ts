/** Formateadores compartidos: fechas en es-CO y moneda en pesos colombianos (COP). */

const formateadorFecha = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formateadorFechaHora = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const formateadorMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatearFecha(iso: string): string {
  return formateadorFecha.format(new Date(iso))
}

export function formatearFechaHora(iso: string): string {
  return formateadorFechaHora.format(new Date(iso))
}

export function formatearMoneda(valor: number): string {
  return formateadorMoneda.format(valor)
}
