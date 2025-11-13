# Configuración de Base de Datos - Seki

## Estado Actual

✅ **Esquema de base de datos creado** (`prisma/schema.prisma`)
✅ **Cliente Prisma configurado** (`src/lib/prisma.ts`)
✅ **Script de seed creado** (`prisma/seed.ts`)
✅ **Servicios migrados a Prisma** (con fallback a mock data)
⏳ **Pendiente**: Instalar dependencias y configurar base de datos

## Próximos Pasos

### 1. Instalar Dependencias

Cuando tengas espacio en disco, ejecuta:

```bash
npm install prisma @prisma/client tsx
```

### 2. Configurar Base de Datos

1. Crea un archivo `.env` en la raíz:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/seki?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

2. Genera el cliente de Prisma:

```bash
npm run db:generate
```

3. Crea las tablas:

```bash
npm run db:push
```

4. Pobla con datos de prueba:

```bash
npm run db:seed
```

### 3. Verificar que todo funcione

Los siguientes servicios ya están migrados y funcionarán automáticamente con Prisma cuando la DB esté configurada:

- ✅ `src/modules/auth/service.ts` - Registro, login, creación de owners
- ✅ `src/modules/restaurant-requests/service.ts` - CRUD de solicitudes
- ✅ `src/modules/places/service.ts` - Listado y detalle de lugares
- ✅ `src/modules/bookings/service.ts` - Crear, listar, cancelar reservas

**Nota**: Todos los servicios tienen fallback a mock data, así que la app funcionará incluso sin Prisma instalado.

## Estructura de la Base de Datos

### Entidades Principales

1. **User** - Usuarios del sistema (USER, OWNER, ADMIN)
2. **RestaurantRequest** - Solicitudes de restaurantes
3. **Place** - Lugares/restaurantes publicados
4. **Booking** - Reservas de usuarios
5. **Review** - Reseñas (para el futuro)

### Relaciones

- User → RestaurantRequest (1:1) - Un owner tiene una solicitud
- User → Place (1:N) - Un owner puede tener múltiples lugares
- User → Booking (1:N) - Un usuario puede tener múltiples reservas
- Place → Booking (1:N) - Un lugar puede tener múltiples reservas
- Place → Review (1:N) - Un lugar puede tener múltiples reseñas
- User → Review (1:N) - Un usuario puede dejar múltiples reseñas

## Scripts Disponibles

- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema (desarrollo)
- `npm run db:migrate` - Crear migraciones (producción)
- `npm run db:studio` - Abrir Prisma Studio (GUI)
- `npm run db:seed` - Poblar DB con datos de prueba

## Notas

- El seed crea usuarios de prueba con las mismas credenciales que los mocks
- Las contraseñas están en texto plano (solo para desarrollo)
- En producción, implementa hashing con bcrypt

