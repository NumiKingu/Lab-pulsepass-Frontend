import { http, HttpResponse } from 'msw'

/**
 * Handlers MSW para los 23 endpoints (20 REST + 3 de auth), con los datos de referencia
 * del escenario (sección 22 del PRD): sede VEN-SMR-01, evento CMF-2026, usuaria Andrea.
 */

const sede = {
  id: 1,
  code: 'VEN-SMR-01',
  name: 'Marina Convention Center',
  city: 'Santa Marta',
  address: 'Calle 1 # 2-3',
  capacity: 3,
  active: true,
}

const artista = { id: 1, stageName: 'Solar Beat', country: 'CO', genre: 'Electrónica', active: true }

const eventoPublicado = {
  id: 1,
  eventCode: 'CMF-2026',
  name: 'Caribbean Music Fest 2026',
  description: 'Un festival frente al mar.',
  category: 'MUSIC',
  status: 'PUBLISHED',
  eventDate: '2026-12-12T20:00:00',
  minimumAge: 18,
  venueCode: sede.code,
  venueName: sede.name,
  artists: [artista],
}

const eventoResumen = {
  id: eventoPublicado.id,
  eventCode: eventoPublicado.eventCode,
  name: eventoPublicado.name,
  category: eventoPublicado.category,
  status: eventoPublicado.status,
  eventDate: eventoPublicado.eventDate,
  venueName: sede.name,
  venueCity: sede.city,
}

const ticketAndrea = {
  id: 1,
  ticketCode: 'TKT-8F2A1C',
  type: 'VIP',
  price: 250000,
  status: 'PAID',
  purchaseDate: '2026-11-05T14:32:00',
  userEmail: 'andrea@pulsepass.test',
  eventCode: eventoPublicado.eventCode,
  eventName: eventoPublicado.name,
}

export const handlers = [
  // --- Auth (Fase 4) ---
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { identifier: string; password: string }
    if (body.identifier !== 'andrea' || body.password !== 'contraseña-valida') {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 401, error: 'Unauthorized', message: 'Credenciales inválidas', details: {} },
        { status: 401 },
      )
    }
    return HttpResponse.json({ accessToken: 'token-de-prueba', tokenType: 'Bearer', expiresIn: 900 })
  }),

  http.get('/api/auth/me', ({ request }) => {
    if (!request.headers.get('authorization')) {
      return HttpResponse.json(
        { timestamp: new Date().toISOString(), status: 401, error: 'Unauthorized', message: 'No autenticado', details: {} },
        { status: 401 },
      )
    }
    return HttpResponse.json({ id: 1, username: 'andrea', roles: ['USER'] })
  }),

  // --- Usuarios ---
  http.post('/api/users', () =>
    HttpResponse.json(
      {
        id: 2,
        username: 'andrea',
        email: 'andrea@pulsepass.test',
        active: true,
        firstName: 'Andrea',
        lastName: 'Ruiz',
        phone: null,
        city: 'Santa Marta',
        birthDate: '1998-04-12',
      },
      { status: 201 },
    ),
  ),
  http.get('/api/users/by-email', ({ request }) => {
    const email = new URL(request.url).searchParams.get('email')
    return HttpResponse.json({
      id: 2,
      username: 'andrea',
      email,
      active: true,
      firstName: 'Andrea',
      lastName: 'Ruiz',
      phone: null,
      city: 'Santa Marta',
      birthDate: '1998-04-12',
    })
  }),
  http.get('/api/users/by-username', ({ request }) => {
    const username = new URL(request.url).searchParams.get('username')
    return HttpResponse.json({
      id: 2,
      username,
      email: 'andrea@pulsepass.test',
      active: true,
      firstName: 'Andrea',
      lastName: 'Ruiz',
      phone: null,
      city: 'Santa Marta',
      birthDate: '1998-04-12',
    })
  }),

  // --- Venues ---
  http.get('/api/venues/active', () => HttpResponse.json([sede])),
  http.get('/api/venues/:code', ({ params }) =>
    params.code === sede.code
      ? HttpResponse.json(sede)
      : HttpResponse.json(
          { timestamp: new Date().toISOString(), status: 404, error: 'Not Found', message: 'Sede no encontrada', details: {} },
          { status: 404 },
        ),
  ),

  // --- Artistas ---
  http.get('/api/artists/active', () => HttpResponse.json([artista])),
  http.get('/api/artists/:id', ({ params }) => HttpResponse.json({ ...artista, id: Number(params.id) })),
  http.get('/api/artists/by-stage-name', () => HttpResponse.json(artista)),

  // --- Eventos ---
  http.get('/api/events/published', () => HttpResponse.json([eventoResumen])),
  http.get('/api/events/by-artist', () => HttpResponse.json([eventoResumen])),
  http.get('/api/events/:eventCode', ({ params }) =>
    params.eventCode === eventoPublicado.eventCode
      ? HttpResponse.json(eventoPublicado)
      : HttpResponse.json(
          { timestamp: new Date().toISOString(), status: 404, error: 'Not Found', message: 'Evento no encontrado', details: {} },
          { status: 404 },
        ),
  ),
  http.post('/api/events', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { ...eventoPublicado, ...body, status: 'DRAFT', venueName: sede.name, artists: [] },
      { status: 201 },
    )
  }),
  http.patch('/api/events/:eventCode/publish', () => HttpResponse.json({ ...eventoPublicado, status: 'PUBLISHED' })),
  http.post('/api/events/:eventCode/artists/:artistId', () =>
    HttpResponse.json({ ...eventoPublicado, artists: [artista] }),
  ),
  http.get('/api/events/:eventCode/tickets/paid', () => HttpResponse.json([ticketAndrea])),

  // --- Tickets ---
  http.post('/api/tickets', async ({ request }) => {
    const body = (await request.json()) as { type: string }
    return HttpResponse.json({ ...ticketAndrea, type: body.type, status: 'PAID' }, { status: 201 })
  }),
  http.get('/api/tickets/by-user', () => HttpResponse.json([ticketAndrea])),
  http.get('/api/tickets/:ticketCode', ({ params }) =>
    params.ticketCode === ticketAndrea.ticketCode
      ? HttpResponse.json(ticketAndrea)
      : HttpResponse.json(
          { timestamp: new Date().toISOString(), status: 404, error: 'Not Found', message: 'Ticket no encontrado', details: {} },
          { status: 404 },
        ),
  ),
  http.patch('/api/tickets/:ticketCode/cancel', () => HttpResponse.json({ ...ticketAndrea, status: 'CANCELLED' })),
  http.patch('/api/tickets/:ticketCode/use', () => HttpResponse.json({ ...ticketAndrea, status: 'USED' })),
]
