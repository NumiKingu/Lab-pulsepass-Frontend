import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server'

// RTL solo limpia el DOM automáticamente entre pruebas cuando detecta globals de test;
// como el proyecto corre con `test.globals: false`, se registra explícitamente aquí.
afterEach(() => cleanup())

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
