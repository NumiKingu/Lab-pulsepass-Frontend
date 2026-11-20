import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import RutaPorRol from './RutaPorRol'
import type { Sesion } from '../funcionalidades/auth/tipos'

const mockUseAuth = vi.fn()
vi.mock('../funcionalidades/auth/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

function montarConSesion(sesion: Sesion, roles: ('USER' | 'STAFF' | 'ADMIN')[]) {
  mockUseAuth.mockReturnValue({ sesion })
  const router = createMemoryRouter(
    [
      {
        path: '/admin',
        Component: () => <RutaPorRol roles={roles} />,
        children: [{ index: true, element: <p>Panel admin</p> }],
      },
      { path: '/login', element: <p>Página de login</p> },
      { path: '/403', element: <p>Sin permisos</p> },
    ],
    { initialEntries: ['/admin'] },
  )
  render(<RouterProvider router={router} />)
}

describe('RutaPorRol', () => {
  it('redirige a /login cuando no hay sesión', () => {
    montarConSesion({ estado: 'anonimo' }, ['ADMIN'])
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })

  it('redirige a /403 cuando el rol es insuficiente', () => {
    montarConSesion(
      { estado: 'autenticado', token: 't', expiraEn: Date.now() + 1000, usuario: { id: 1, username: 'u', email: 'u@x.com', roles: ['USER'] } },
      ['ADMIN'],
    )
    expect(screen.getByText('Sin permisos')).toBeInTheDocument()
  })

  it('renderiza el contenido cuando el rol coincide', () => {
    montarConSesion(
      { estado: 'autenticado', token: 't', expiraEn: Date.now() + 1000, usuario: { id: 1, username: 'u', email: 'u@x.com', roles: ['ADMIN'] } },
      ['ADMIN'],
    )
    expect(screen.getByText('Panel admin')).toBeInTheDocument()
  })
})
