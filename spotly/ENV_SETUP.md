# Configuración de Variables de Entorno

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
# Para desarrollo local con PostgreSQL:
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/seki?schema=public"

# Para producción (Neon, Supabase, Railway, etc.):
# DATABASE_URL="postgresql://usuario:contraseña@host:5432/database?schema=public"

# Usar mock data (true) o base de datos real (false)
# En desarrollo: puede ser "true" para trabajar sin DB
# En producción: DEBE ser "false"
NEXT_PUBLIC_USE_MOCK_DATA="true"

# Entorno
NODE_ENV="development"

# API URL (si tienes backend separado)
# NEXT_PUBLIC_API_URL="http://localhost:3333/api/v1"
```

## Variables para Producción (Vercel)

Configura estas variables en Vercel (Settings → Environment Variables):

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?schema=public
NEXT_PUBLIC_USE_MOCK_DATA=false
NODE_ENV=production
```

## Notas

- El archivo `.env` está en `.gitignore` y no se sube al repositorio
- Para producción, configura las variables en el dashboard de Vercel
- Nunca subas credenciales reales al repositorio

