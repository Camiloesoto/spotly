## Spotly

Plataforma de reservas y preorden para restaurantes, bares y discotecas.

Este repositorio contiene el frontend web construido con Next.js 14 (app router), TypeScript y Tailwind CSS. El objetivo es entregar incrementos quincenales alineados a las historias de usuario descritas en los sprints iniciales.

---

## Visión Técnica

- **Frontend:** Next.js (app router) + Tailwind CSS + Zustand + React Query + Axios/fetch.
- **Backend (proyectado):** NestJS + PostgreSQL + Prisma ORM + JWT (access/refresh).
- **Infraestructura:** Docker, Railway/Render/Fly.io, GitHub Actions.
- **Buenas prácticas:** TypeScript en todo lado, arquitectura en capas, validaciones en bordes, tests con Jest.

---

## Roadmap por Sprints

### Sprint 1 – Fundaciones
- S1-1 Registro de usuarios (email o Google).
- S1-2 Inicio de sesión.
- S1-3 Listado de lugares cercanos.
- S1-4 Búsqueda por nombre.
- S1-5 Registro de local.
- S1-6 Edición de perfil de local.
- S1-7 Aprobación de locales (admin).

### Sprint 2 – Reservas
- S2-1 Ficha de lugar (detalles completos).
- S2-2 Reseñas y calificaciones.
- S2-3 Crear reserva.
- S2-4 Estado de reserva.
- S2-5 Cancelar reserva.
- S2-6 Panel de reservas del local.
- S2-7 Aceptar o rechazar reservas.

### Sprint 3 – Experiencia de usuario
- S3-1 Edición de perfil de usuario.
- S3-2 Filtro por tipo de plan.
- S3-3 Filtro por rango de precio.
- S3-4 Guardar favoritos.
- S3-5 Gestión de favoritos.
- S3-6 Notificaciones de reserva.

### Sprint 4 – Versión avanzada
- S4-1 Gestión de menú del local.
- S4-2 Ver menú del lugar.
- S4-3 Preorden al reservar.
- S4-4 Estado de la preorden.
- S4-5 Historial de reservas y pedidos (local).
- S4-6 Moderación de cuentas (admin).
- S4-7 Métricas de la plataforma (admin).

---

## Estructura Inicial (objetivo)

```
src/
  app/
    (auth)/
      login/
      register/
    (public)/
      page.tsx         # landing
      places/
        page.tsx       # listado
    (dashboard)/
      owner/
      admin/
      user/
  modules/
    auth/
    places/
    bookings/
    profiles/
  lib/
    api/
    auth/
    store/
```

La implementación se irá completando iterativamente. Cada módulo incluirá hooks, servicios, tipos y tests específicos.

---

## Scripts útiles

```bash
# iniciar en desarrollo
npm run dev

# lint
npm run lint
```

---

## Próximos pasos inmediatos

1. Configurar carpetas base (`src/modules`, `src/app/(auth|dashboard|public)`).
2. Definir contrato de API interno (`src/lib/api/client.ts`).
3. Implementar flujo mínimo de autenticación (mock + UI) para Sprint 1.
4. Integrar estado global (Zustand) y React Query.
