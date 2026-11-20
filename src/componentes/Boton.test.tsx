import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Boton } from './Boton'

describe('Boton', () => {
  it('ejecuta onClick al hacer clic', async () => {
    const alHacerClic = vi.fn()
    render(<Boton onClick={alHacerClic}>Guardar</Boton>)

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(alHacerClic).toHaveBeenCalledOnce()
  })

  it('se deshabilita y muestra "Cargando…" cuando cargando=true', () => {
    render(<Boton cargando>Guardar</Boton>)

    const boton = screen.getByRole('button', { name: 'Cargando…' })
    expect(boton).toBeDisabled()
    expect(boton).toHaveAttribute('aria-busy', 'true')
  })
})
