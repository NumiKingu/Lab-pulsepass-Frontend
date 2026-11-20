/**
 * Centraliza todas las rutas de la aplicación (FE-003): nunca se escriben
 * strings de ruta sueltos en componentes o páginas.
 */
export const RUTAS = {
  inicio: '/',
  eventos: '/eventos',
  evento: (eventCode: string) => `/eventos/${eventCode}`,
  artistas: '/artistas',
  artista: (id: number | string) => `/artistas/${id}`,
  sedes: '/sedes',
  sede: (code: string) => `/sedes/${code}`,
  login: '/login',
  registro: '/registro',
  cuenta: '/cuenta',
  misTickets: '/mis-tickets',
  detalleTicket: (ticketCode: string) => `/mis-tickets/${ticketCode}`,
  confirmacionCompra: (ticketCode: string) => `/compra/confirmacion/${ticketCode}`,
  staffValidacion: '/staff/validacion',
  staffTicketsPagados: (eventCode: string) => `/staff/eventos/${eventCode}/tickets`,
  adminEventos: '/admin/eventos',
  adminCrearEvento: '/admin/eventos/nuevo',
  adminGestionEvento: (eventCode: string) => `/admin/eventos/${eventCode}`,
  sinPermisos: '/403',
} as const
