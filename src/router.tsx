import { createBrowserRouter } from 'react-router'
import { Layout } from './layouts/Layout'
import Inicio from './pages/Inicio'
import ErrorPagina from './pages/ErrorPagina'
import NoEncontrada from './pages/NoEncontrada'
import RutaProtegida from './layouts/RutaProtegida'
import RutaPorRol from './layouts/RutaPorRol'
import SoloAnonimo from './layouts/SoloAnonimo'

/**
 * createBrowserRouter + RouterProvider (react-router, NO react-router-dom): FE-007.
 * Todas las páginas se cargan con lazy (FE-012), excepto Layout e Inicio.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <ErrorPagina />,
    children: [
      { index: true, Component: Inicio },
      { path: 'eventos', lazy: () => import('./pages/CatalogoEventos') },
      { path: 'eventos/:eventCode', lazy: () => import('./pages/DetalleEvento') },
      { path: 'artistas', lazy: () => import('./pages/ListaArtistas') },
      { path: 'artistas/:id', lazy: () => import('./pages/DetalleArtista') },
      { path: 'sedes', lazy: () => import('./pages/ListaSedes') },
      { path: 'sedes/:code', lazy: () => import('./pages/DetalleSede') },

      {
        Component: SoloAnonimo,
        children: [
          { path: 'login', lazy: () => import('./pages/Login') },
          { path: 'registro', lazy: () => import('./pages/Registro') },
        ],
      },

      {
        Component: RutaProtegida,
        children: [
          { path: 'cuenta', lazy: () => import('./pages/Cuenta') },
          {
            Component: () => <RutaPorRol roles={['USER']} />,
            children: [
              { path: 'mis-tickets', lazy: () => import('./pages/MisTickets') },
              { path: 'mis-tickets/:ticketCode', lazy: () => import('./pages/DetalleTicket') },
              { path: 'compra/confirmacion/:ticketCode', lazy: () => import('./pages/ConfirmacionCompra') },
            ],
          },
          {
            Component: () => <RutaPorRol roles={['STAFF', 'ADMIN']} />,
            children: [
              { path: 'staff/validacion', lazy: () => import('./pages/ValidacionIngreso') },
              { path: 'staff/eventos/:eventCode/tickets', lazy: () => import('./pages/TicketsPagadosEvento') },
            ],
          },
          {
            Component: () => <RutaPorRol roles={['ADMIN']} />,
            children: [
              { path: 'admin/eventos', lazy: () => import('./pages/AdminEventos') },
              { path: 'admin/eventos/nuevo', lazy: () => import('./pages/AdminCrearEvento') },
              { path: 'admin/eventos/:eventCode', lazy: () => import('./pages/AdminGestionEvento') },
            ],
          },
        ],
      },

      { path: '403', lazy: () => import('./pages/SinPermisos') },
      { path: '*', Component: NoEncontrada },
    ],
  },
])
