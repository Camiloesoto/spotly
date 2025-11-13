# Guía de Despliegue - Seki

Esta guía explica cómo configurar y desplegar Seki con base de datos PostgreSQL.

## Requisitos Previos

- Node.js 20+ instalado
- PostgreSQL instalado y corriendo (o cuenta en servicio en la nube)
- Cuenta en Vercel (o servicio de hosting de tu elección)

## Configuración Local

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Base de Datos

1. Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/seki?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

2. Genera el cliente de Prisma:

```bash
npm run db:generate
```

3. Crea las tablas en la base de datos:

```bash
npm run db:push
```

O si prefieres usar migraciones:

```bash
npm run db:migrate
```

4. Pobla la base de datos con datos de prueba:

```bash
npm run db:seed
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

## Despliegue en Vercel

### Opción 1: Despliegue Automático desde GitHub

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. Configura las variables de entorno:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `NEXT_PUBLIC_USE_MOCK_DATA`: `false`
   - `NODE_ENV`: `production`

4. Vercel ejecutará automáticamente `npm run build`

### Opción 2: Despliegue Manual con Vercel CLI

1. Instala Vercel CLI:

```bash
npm i -g vercel
```

2. Inicia sesión:

```bash
vercel login
```

3. Despliega:

```bash
vercel
```

4. Configura las variables de entorno en el dashboard de Vercel

## Base de Datos en la Nube

### Opciones Recomendadas:

1. **Neon** (PostgreSQL serverless)
   - URL: https://neon.tech
   - Gratis para empezar
   - Fácil de configurar

2. **Supabase** (PostgreSQL + extras)
   - URL: https://supabase.com
   - Incluye autenticación y storage
   - Plan gratuito generoso

3. **Railway** (PostgreSQL)
   - URL: https://railway.app
   - Fácil de usar
   - Plan gratuito disponible

4. **Render** (PostgreSQL)
   - URL: https://render.com
   - Plan gratuito disponible

### Configuración con Neon (Ejemplo)

1. Crea una cuenta en Neon
2. Crea un nuevo proyecto
3. Copia la connection string
4. Agrégala como variable de entorno `DATABASE_URL` en Vercel
5. Ejecuta las migraciones:

```bash
DATABASE_URL="tu_connection_string" npm run db:push
DATABASE_URL="tu_connection_string" npm run db:seed
```

## Variables de Entorno en Producción

Configura estas variables en tu plataforma de hosting:

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?schema=public
NEXT_PUBLIC_USE_MOCK_DATA=false
NODE_ENV=production
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema con DB (sin migraciones)
- `npm run db:migrate` - Crear y aplicar migraciones
- `npm run db:studio` - Abrir Prisma Studio (GUI para DB)
- `npm run db:seed` - Poblar DB con datos de prueba

## Notas Importantes

- En producción, asegúrate de que `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Las contraseñas en el seed están en texto plano (solo para desarrollo)
- En producción, implementa hashing de contraseñas (bcrypt)
- Configura CORS si necesitas conectar con un backend separado

