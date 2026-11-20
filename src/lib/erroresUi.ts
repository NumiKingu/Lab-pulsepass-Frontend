import { ApiError, ApiNetworkError } from './http'

/**
 * Traduce un error capturado (ApiError / ApiNetworkError / desconocido) al mensaje
 * que debe verse en pantalla, siguiendo el mapeo HTTP → interfaz (sección 13 del PRD).
 * El mensaje de un 409 viene tal cual del backend (regla de negocio ya redactada para humanos).
 */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiNetworkError) {
    return 'No pudimos conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.'
  }
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return error.message || 'Revisa los datos del formulario.'
      case 401:
        return 'Credenciales inválidas.'
      case 403:
        return 'No tienes permisos para realizar esta operación.'
      case 404:
        return 'No encontramos lo que buscabas.'
      case 409:
        return error.message
      default:
        return 'Ocurrió un error inesperado. Inténtalo más tarde.'
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo más tarde.'
}
