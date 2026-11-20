import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from './api'
import type { PurchaseTicketRequest } from './tipos'

/** useTicket (operación #16). */
export function useTicket(ticketCode: string | undefined) {
  return useQuery({
    queryKey: ['ticket', ticketCode],
    queryFn: () => ticketsApi.porCodigo(ticketCode as string),
    enabled: Boolean(ticketCode),
    staleTime: 15_000,
  })
}

/** useMisTickets (operación #17). */
export function useMisTickets(email: string | undefined) {
  return useQuery({
    queryKey: ['tickets', 'usuario', email],
    queryFn: () => ticketsApi.porUsuario(email as string),
    enabled: Boolean(email),
    staleTime: 15_000,
  })
}

/** useTicketsPagadosPorEvento (operación #18, STAFF/ADMIN). */
export function useTicketsPagadosPorEvento(eventCode: string | undefined) {
  return useQuery({
    queryKey: ['tickets', 'pagados', eventCode],
    queryFn: () => ticketsApi.pagadosPorEvento(eventCode as string),
    enabled: Boolean(eventCode),
    staleTime: 15_000,
  })
}

/** useComprarTicket (operación #15, solo USER). */
export function useComprarTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: PurchaseTicketRequest) => ticketsApi.comprar(datos),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'usuario', ticket.userEmail] })
      queryClient.invalidateQueries({ queryKey: ['evento', ticket.eventCode] })
    },
  })
}

/** useCancelarTicket (operación #19). */
export function useCancelarTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ticketCode: string) => ticketsApi.cancelar(ticketCode),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'usuario', ticket.userEmail] })
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.ticketCode] })
      queryClient.invalidateQueries({ queryKey: ['tickets', 'pagados', ticket.eventCode] })
    },
  })
}

/** useUsarTicket (operación #20, STAFF/ADMIN). */
export function useUsarTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ticketCode: string) => ticketsApi.usar(ticketCode),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.ticketCode] })
      queryClient.invalidateQueries({ queryKey: ['tickets', 'pagados', ticket.eventCode] })
    },
  })
}
