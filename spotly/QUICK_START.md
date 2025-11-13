# Guía Rápida - Seki

## Estado del Proyecto

✅ **Frontend completo** - Todas las pantallas funcionando
✅ **Autenticación** - Login, registro, roles (user, owner, admin)
✅ **Lugares** - Listado, búsqueda, filtros, mapa, detalle
✅ **Reservas** - Crear, ver, cancelar reservas
✅ **Solicitudes de restaurantes** - Flujo completo de registro
✅ **Base de datos** - Esquema Prisma listo, servicios migrados
⏳ **Pendiente**: Instalar Prisma y configurar DB

## Opción 1: Usar Mock Data (Actual)

La aplicación ya funciona perfectamente con **mock data**. No necesitas instalar nada adicional:

```bash
npm run dev
```

Accede a `http://localhost:3000` y todo funcionará con datos de ejemplo.

### Usuarios de prueba:
- **Admin**: `admin@seki.com` / `admin123`
- **Usuario**: `usuario@seki.com` / `usuario123`
- **Owner**: `maria.gonzalez@terraza.com` / `owner123`

## Opción 2: Configurar Base de Datos Real

### Paso 1: Instalar dependencias (cuando tengas espacio)

```bash
npm install
```

### Paso 2: Crear base de datos

**Opción A - Base de datos local (PostgreSQL):**
```bash
# Instalar PostgreSQL y crear base de datos
createdb seki
```

**Opción B - Base de datos en la nube (Recomendado):**
- [Neon](https://neon.tech) - PostgreSQL gratuito
- [Supabase](https://supabase.com) - PostgreSQL + extras
- [Railway](https://railway.app) - PostgreSQL fácil

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
# URL de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@host:5432/seki?schema=public"

# Desactivar mock data
NEXT_PUBLIC_USE_MOCK_DATA="false"

# Entorno
NODE_ENV="development"
```

### Paso 4: Inicializar base de datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear tablas
npm run db:push

# Poblar con datos de prueba
npm run db:seed
```

### Paso 5: Iniciar aplicación

```bash
npm run dev
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:push          # Sincronizar esquema (desarrollo)
npm run db:migrate       # Crear migraciones (producción)
npm run db:studio        # Abrir Prisma Studio (GUI)
npm run db:seed          # Poblar DB con datos de prueba

# Build y producción
npm run build            # Compilar para producción
npm run start            # Iniciar servidor de producción
npm run lint             # Verificar código
```

## Despliegue

Ver `DEPLOY.md` para instrucciones detalladas de despliegue.

### Plataformas recomendadas:
- **Frontend**: [Vercel](https://vercel.com) - Deploy automático desde GitHub
- **Base de datos**: [Neon](https://neon.tech) o [Supabase](https://supabase.com)

## Problemas Comunes

### Error: "Cannot find module '@prisma/client'"
**Solución**: Instala las dependencias:
```bash
npm install prisma @prisma/client tsx
```

### Error: "No space left on device"
**Solución**: Libera espacio en disco o usa una base de datos en la nube (Neon/Supabase)

### La app funciona pero no guarda datos
**Solución**: Estás usando mock data. Configura la base de datos real siguiendo la Opción 2.

## Siguiente Paso

¿Ya probaste la aplicación? ¡Perfecto! El siguiente paso sería:

1. **Implementar más funcionalidades** del backlog
2. **Configurar base de datos** cuando tengas espacio
3. **Desplegar** a producción para pruebas reales

¿Necesitas ayuda con algo específico? Solo pregunta!

