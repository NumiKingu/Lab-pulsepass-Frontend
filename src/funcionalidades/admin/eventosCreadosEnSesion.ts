/**
 * GAP-01: la API no ofrece un listado completo de eventos. El panel ADMIN compensa
 * recordando, solo para esta pestaña, los eventos creados durante la sesión
 * (se pierde al cerrar la pestaña — limitación documentada en el PRD, sección 9.16).
 */
const CLAVE = 'pulsepass.eventosCreadosEnSesion'

export interface EventoCreadoEnSesion {
  eventCode: string
  name: string
}

export function leerEventosCreadosEnSesion(): EventoCreadoEnSesion[] {
  try {
    const crudo = sessionStorage.getItem(CLAVE)
    if (!crudo) return []
    const datos: unknown = JSON.parse(crudo)
    return Array.isArray(datos) ? (datos as EventoCreadoEnSesion[]) : []
  } catch {
    return []
  }
}

export function registrarEventoCreadoEnSesion(evento: EventoCreadoEnSesion) {
  const actuales = leerEventosCreadosEnSesion()
  if (actuales.some((e) => e.eventCode === evento.eventCode)) return
  sessionStorage.setItem(CLAVE, JSON.stringify([evento, ...actuales]))
}
