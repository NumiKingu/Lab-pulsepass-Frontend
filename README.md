# PulsePass — Frontend

SPA en React + TypeScript + Tailwind CSS que consume la API REST segura de **PulsePass**
(repositorio `Lab-pulsepass`, Spring Boot + JWT). Implementa la Fase 5 del caso de estudio
académico: catálogo de eventos, compra y gestión de tickets, validación de ingreso (STAFF)
y administración de eventos (ADMIN).

Este repositorio es independiente del backend: no redefine el dominio ni las reglas de
negocio, solo las consume por HTTP.

## Stack

Node 22.22+ · React 19.2.7+ · TypeScript (strict) · Vite · Tailwind CSS v4 · React Router v8 ·
TanStack Query · React Hook Form + Zod · Vitest + Testing Library + MSW.

## Variables de entorno

Copia `.env.example` a `.env`:

```
VITE_API_BASE_URL=/api
```

En desarrollo, `/api` es reenviado por el proxy de Vite (`vite.config.ts`) hacia
`http://localhost:8080`. En producción, apunta al dominio público del backend
(ver sección de despliegue más abajo).

## Comandos

| Comando           | Qué hace                                               |
| ----------------- | ------------------------------------------------------- |
| `npm install`      | Instala dependencias                                    |
| `npm run dev`      | Levanta el servidor de desarrollo (con proxy a `/api`)   |
| `npm run build`    | Compila TypeScript y genera el build de producción      |
| `npm run preview`  | Sirve el build de `dist/` localmente                     |
| `npm run lint`     | ESLint                                                   |
| `npm test`         | Ejecuta las pruebas con Vitest                           |
| `npm run test:watch` | Pruebas en modo watch                                 |

## Requisitos para correr en local

1. El backend `Lab-pulsepass` corriendo en `http://localhost:8080` con PostgreSQL y las
   variables de entorno de seguridad (`PULSEPASS_JWT_SECRET_BASE64`, etc.).
2. Usuarios de demostración (perfil `dev` del backend):

   | Usuario  | Rol   | Notas                                   |
   | -------- | ----- | ---------------------------------------- |
   | `miguel` | ADMIN | `PULSEPASS_SEED_ADMIN_PASSWORD`          |
   | `laura`  | STAFF | `PULSEPASS_SEED_STAFF_PASSWORD`          |
   | —        | USER  | Regístralo desde `/registro`             |

## Rutas principales

| Ruta                                   | Acceso      | Página                 |
| --------------------------------------- | ----------- | ----------------------- |
| `/`                                      | Público     | Inicio                  |
| `/eventos`, `/eventos/:eventCode`        | Público     | Catálogo y detalle      |
| `/artistas`, `/artistas/:id`             | Público     | Artistas                |
| `/sedes`, `/sedes/:code`                 | Público     | Sedes                   |
| `/login`, `/registro`                    | Anónimo     | Autenticación           |
| `/cuenta`                                 | Autenticado | Perfil                  |
| `/mis-tickets`, `/mis-tickets/:code`     | USER        | Tickets propios         |
| `/compra/confirmacion/:ticketCode`       | USER        | Confirmación de compra  |
| `/staff/validacion`                       | STAFF/ADMIN | Validar ingreso         |
| `/staff/eventos/:eventCode/tickets`      | STAFF/ADMIN | Tickets pagados         |
| `/admin/eventos`, `/nuevo`, `/:eventCode`| ADMIN       | Administración          |

## Notas sobre brechas conocidas del backend

- **GAP-01**: no existe `GET /api/events` (listar todos). El panel ADMIN recuerda, solo
  durante la sesión del navegador, los eventos creados (`sessionStorage`).
- **GAP-03**: `AuthenticatedUserResponse` (`GET /api/auth/me`) no incluye el email. Tras el
  login, `AuthContext` completa el email con `GET /api/users/by-username`, necesario para
  comprar tickets y para "Mis tickets".
- **GAP-05**: el backend no configura CORS por defecto. En desarrollo se usa el proxy de
  Vite; en producción, el backend necesita `PULSEPASS_CORS_ALLOWED_ORIGINS` apuntando al
  dominio de este frontend (o ambos deben servirse desde el mismo origen).

## Despliegue

Ver la guía paso a paso adjunta (`pulsepass-frontend-paso-a-paso.html`), sección 18.
