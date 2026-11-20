import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderConProveedores } from '../../../test/utils'
import { FormularioLogin } from './FormularioLogin'

describe('FormularioLogin', () => {
  it('muestra "Credenciales inválidas" en un 401', async () => {
    renderConProveedores(<FormularioLogin />, { rutaInicial: '/login' })

    await userEvent.type(screen.getByLabelText('Usuario o correo'), 'andrea')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password-incorrecta')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('Credenciales inválidas.')).toBeInTheDocument()
  })

  it('valida que los campos no estén vacíos antes de llamar a la API', async () => {
    renderConProveedores(<FormularioLogin />, { rutaInicial: '/login' })

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText(/Ingresa tu usuario o correo/)).toBeInTheDocument()
    expect(screen.getByText(/Ingresa tu contraseña/)).toBeInTheDocument()
  })
})
