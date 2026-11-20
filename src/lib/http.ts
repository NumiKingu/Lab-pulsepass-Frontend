/**
 * Cliente HTTP único de la aplicación (fetch nativo, sin Axios).
 * - Agrega `Authorization: Bearer <token>` cuando hay sesión.
 * - Valida el cuerpo de error contra el contrato uniforme del backend (ErrorResponse) con zod.
 * - Nunca construye reglas de negocio aquí: solo transporta y traduce errores (FE-001).
 */
import { z } from 'zod'

const ErrorResponseSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number(),
  error: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.string()).optional().default({}),
})

export class ApiError extends Error {
  readonly status: number
  readonly details: Record<string, string>

  constructor(status: number, message: string, details: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/** Error de red (sin conexión, backend caído, CORS bloqueado, etc.), distinto de un error HTTP. */
export class ApiNetworkError extends Error {
  constructor() {
    super('No pudimos conectar con el servidor.')
    this.name = 'ApiNetworkError'
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

/** Lee/escribe el token de sesión. Se inyecta desde AuthContext para evitar un import circular. */
let obtenerToken: () => string | null = () => null
export function registrarProveedorDeToken(fn: () => string | null) {
  obtenerToken = fn
}

/** Se invoca ante cualquier 401: AuthContext la usa para cerrar la sesión local. */
let manejadorNoAutorizado: () => void = () => {}
export function registrarManejadorNoAutorizado(fn: () => void) {
  manejadorNoAutorizado = fn
}

export interface OpcionesSolicitud {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  params?: Record<string, string | number | undefined>
}

function construirUrl(ruta: string, params?: OpcionesSolicitud['params']): string {
  const url = new URL(BASE_URL + ruta, window.location.origin)
  if (params) {
    for (const [clave, valor] of Object.entries(params)) {
      if (valor !== undefined) url.searchParams.set(clave, String(valor))
    }
  }
  // BASE_URL puede ser relativo ('/api') o absoluto (https://...); devolvemos siempre
  // la forma que fetch espera, preservando query string.
  return BASE_URL.startsWith('http') ? url.toString() : url.pathname + url.search
}

async function solicitar<T>(ruta: string, opciones: OpcionesSolicitud = {}): Promise<T> {
  const { method = 'GET', body, params } = opciones
  const headers: Record<string, string> = {}
  const token = obtenerToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(ruta, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiNetworkError()
  }

  if (respuesta.status === 204) {
    return undefined as T
  }

  const texto = await respuesta.text()
  const json: unknown = texto ? JSON.parse(texto) : undefined

  if (!respuesta.ok) {
    const parseo = ErrorResponseSchema.safeParse(json)
    if (respuesta.status === 401) manejadorNoAutorizado()
    if (parseo.success) {
      throw new ApiError(parseo.data.status, parseo.data.message, parseo.data.details)
    }
    throw new ApiError(respuesta.status, 'Ocurrió un error inesperado. Inténtalo más tarde.')
  }

  return json as T
}

export const http = {
  get: <T>(ruta: string, params?: OpcionesSolicitud['params']) =>
    solicitar<T>(ruta, { method: 'GET', params }),
  post: <T>(ruta: string, body?: unknown) => solicitar<T>(ruta, { method: 'POST', body }),
  patch: <T>(ruta: string, body?: unknown) => solicitar<T>(ruta, { method: 'PATCH', body }),
}

/** Valida `json` con el esquema zod dado; si no cumple, lo trata como error de contrato. */
export function validar<T>(esquema: z.ZodType<T>, datos: unknown): T {
  const parseo = esquema.safeParse(datos)
  if (!parseo.success) {
    throw new ApiError(0, 'La respuesta de la API no tiene el formato esperado.')
  }
  return parseo.data
}
