# Seki

Plataforma para descubrir restaurantes, bares y discotecas, hacer reservas, pre-ordenar y dividir cuentas.

## ¿Qué es Seki?

Seki es una app que te ayuda a encontrar dónde ir y qué reservar según el plan que tengas en mente: restaurante, bar o discoteca. El usuario abre Seki, pone: zona, presupuesto, tipo de música/ambiente y con quién va (pareja, amigos, after office, etc.), y la app le muestra los lugares ideales, con info en tiempo casi real: aforo aproximado, ambiente, promos, eventos, menú y reseñas. Desde ahí mismo puede reservar mesa, pre-ordenar (para que la comida/bebida esté lista al llegar) y dividir la cuenta con sus amigos.

### Factor diferencial

- **Enfoque en la experiencia del plan**, no solo en la reserva
- **Personalización real** con datos del usuario
- **Pre-orden y cuenta inteligente**
- **Un solo ecosistema para el local**: reservas + mesas + pedidos + data en un panel sencillo
- **Insights accionables** para los dueños

---

## Arquitectura

Este repositorio contiene el **frontend web** construido con:

- **Framework:** Next.js 14 (app router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado remoto:** React Query
- **Estado global:** Zustand
- **HTTP Client:** Axios
- **Validación:** Zod + react-hook-form

### Backend (proyectado)

- **Framework:** NestJS
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT (access + refresh tokens)
- **API:** REST

---

## Roadmap por Sprints

### Sprint 1 – Base + autenticación + solicitud de restaurantes

- ✅ HU-U01 – Registro de usuario cliente
- ✅ HU-U02 – Login de usuario cliente
- ✅ HU-U03 – Ver lista de restaurantes cercanos
- ✅ HU-U04 – Buscar restaurante por nombre o zona
- ✅ HU-U05 – Filtrar restaurantes
- ✅ HU-R00 – Solicitud de alta de restaurante (registro de local)
- ✅ HU-A01 – Login de administrador

### Sprint 2 – Explorar restaurantes (lado cliente)

- ✅ HU-U06 – Ver restaurantes en un mapa
- ✅ HU-U07 – Ver ficha de restaurante

### Sprint 3 – Reservas y perfil del usuario cliente

- ✅ HU-U08 – Crear una reserva
- ✅ HU-U09 – Ver mis reservas activas
- ✅ HU-U10 – Cancelar una reserva
- ✅ HU-U11 – Ver estado y confirmación de mi reserva
- ✅ HU-U12 – Editar mi perfil

### Sprint 4 – Flujo restaurante: cuenta, perfil y reservas

- ✅ HU-A03 – Revisar solicitudes de restaurantes
- ✅ HU-A04 – Crear cuenta de restaurante desde una solicitud aprobada
- ⏳ HU-R01 – Activar cuenta de restaurante y definir contraseña
- ⏳ HU-R02 – Login de usuario restaurante
- ✅ HU-R03 – Completar perfil del restaurante y enviarlo a revisión
- ✅ HU-R04 – Configurar capacidad y horarios de reservas
- ✅ HU-R05 – Ver reservas del día
- ✅ HU-R06 – Cambiar el estado de las reservas
- ⏳ HU-R07 – Bloquear horarios específicos

### Sprint 5 – Publicación, control y métricas (lado admin)

- ⏳ HU-A05 – Aprobar y publicar restaurantes
- ⏳ HU-A06 – Ver listado de restaurantes y su estado
- ⏳ HU-A07 – Suspender o reactivar restaurantes / usuarios
- ⏳ HU-A02 – Ver listado de usuarios cliente
- ⏳ HU-A08 – Ver métricas básicas de uso

### Sprint 6 – Valor diferencial y experiencia

- ⏳ HU-U13 – Guardar restaurantes como favoritos
- ⏳ HU-U14 – Ver nivel de ocupación estimado
- ⏳ HU-U15 – Dejar reseña y calificación
- ⏳ HU-R08 – Ver feedback y reseñas de clientes
- ⏳ HU-A09 – Moderar reseñas

---

## Estructura del Proyecto

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
        new/           # registro de local
    (dashboard)/
      owner/
      admin/
      user/
  modules/
    auth/              # autenticación
    places/            # lugares/restaurantes
    bookings/          # reservas
    profiles/          # perfiles
  lib/
    api/               # cliente HTTP
    auth/              # utilidades de auth
    store/             # estado global (Zustand)
    utils/             # utilidades generales
```

---

## Scripts

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

---

## Tecnologías y Buenas Prácticas

- **TypeScript** en todo el código
- **Arquitectura en capas** (controllers → services → repositories)
- **Validación en bordes** (Zod para DTOs)
- **ESLint + Prettier** para estilo de código
- **Git flow** con ramas por feature
- **Tests** con Jest (en desarrollo)

---

## Estado Actual

### ✅ Historias Completadas

**Sprint 1:**
- ✅ **HU-U01** – Registro de usuario cliente (commit: `feat: implement user registration flow`)
- ✅ **HU-U02** – Login de usuario cliente (commit: `feat: deliver optimized login experience`)
- ✅ **HU-U03** – Ver lista de restaurantes cercanos (commit: `feat: implement places listing with search and filters`)
- ✅ **HU-U04** – Buscar restaurante por nombre o zona (commit: `feat: implement places listing with search and filters`)
- ✅ **HU-U05** – Filtrar restaurantes (commit: `feat: implement places listing with search and filters`)
- ✅ **HU-R00** – Solicitud de alta de restaurante (commit: `feat: implement local registration form`)

**Sprint 2:**
- ✅ **HU-U06** – Ver restaurantes en un mapa (commit: `feat: implement map view for places`)
- ✅ **HU-U07** – Ver ficha de restaurante (commit: `feat: implement place detail page`)

**Sprint 1 (completado):**
- ✅ **HU-A01** – Login de administrador (commit: `feat: implement admin login and dashboard`)

### ⏳ En Desarrollo

- Sistema de reservas (Sprint 3)
- Mapa de restaurantes (HU-U06)

---

## Próximos Pasos

1. Implementar ficha detallada de restaurante (HU-U07)
2. Sistema de reservas completo (Sprint 3)
3. Panel de administración para restaurantes
4. Panel de administración para admins
