import { clsx } from 'clsx'
import {
  ETIQUETA_ESTADO_EVENTO,
  ETIQUETA_ESTADO_TICKET,
  type EventStatus,
  type TicketStatus,
} from '../lib/dominio'

/** Mapa tipado y fijo de clases; nunca se construyen dinámicamente (FE-008). */
const CLASES_ESTADO_EVENTO: Record<EventStatus, string> = {
  DRAFT: 'bg-slate-200 text-slate-700',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  SOLD_OUT: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-red-100 text-red-800',
  FINISHED: 'bg-slate-300 text-slate-800',
}

const CLASES_ESTADO_TICKET: Record<TicketStatus, string> = {
  RESERVED: 'bg-sky-100 text-sky-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  USED: 'bg-slate-300 text-slate-800',
}

function BaseBadge({ className, children }: { className: string; children: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}>
      {children}
    </span>
  )
}

export function BadgeEstadoEvento({ estado }: { estado: EventStatus }) {
  return <BaseBadge className={CLASES_ESTADO_EVENTO[estado]}>{ETIQUETA_ESTADO_EVENTO[estado]}</BaseBadge>
}

export function BadgeEstadoTicket({ estado }: { estado: TicketStatus }) {
  return <BaseBadge className={CLASES_ESTADO_TICKET[estado]}>{ETIQUETA_ESTADO_TICKET[estado]}</BaseBadge>
}

export function BadgeRol({ rol }: { rol: string }) {
  return <BaseBadge className="bg-marca-100 text-marca-800">{rol}</BaseBadge>
}
