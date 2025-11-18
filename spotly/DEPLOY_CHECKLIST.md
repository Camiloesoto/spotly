# Checklist de Despliegue - Seki

## Pre-despliegue

### ✅ Configuración Local
- [ ] Clonar repositorio
- [ ] Instalar dependencias: `npm install`
- [ ] Crear archivo `.env` basado en `.env.example`
- [ ] Probar localmente: `npm run dev`
- [ ] Verificar que el build funciona: `npm run build`

### ✅ Base de Datos
- [ ] Crear cuenta en servicio de DB (Neon, Supabase, Railway, etc.)
- [ ] Crear base de datos PostgreSQL
- [ ] Copiar connection string
- [ ] Configurar `DATABASE_URL` en variables de entorno
- [ ] Generar cliente Prisma: `npm run db:generate`
- [ ] Crear tablas: `npm run db:push` o `npm run db:migrate`
- [ ] Poblar con datos de prueba: `npm run db:seed` (opcional)

### ✅ Código
- [ ] Verificar que no hay errores de lint: `npm run lint`
- [ ] Verificar que el build funciona: `npm run build`
- [ ] Probar todas las funcionalidades principales
- [ ] Commit y push de cambios finales

## Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Conectar repositorio**
   - [ ] Ir a [vercel.com](https://vercel.com)
   - [ ] Iniciar sesión con GitHub
   - [ ] Click en "Add New Project"
   - [ ] Seleccionar repositorio `spotly`
   - [ ] Vercel detectará automáticamente Next.js

2. **Configurar variables de entorno**
   - [ ] `DATABASE_URL` - Connection string de PostgreSQL
   - [ ] `NEXT_PUBLIC_USE_MOCK_DATA` - `false`
   - [ ] `NODE_ENV` - `production`

3. **Configurar build**
   - [ ] Framework Preset: Next.js (auto-detectado)
   - [ ] Build Command: `npm run build` (auto)
   - [ ] Output Directory: `.next` (auto)
   - [ ] Install Command: `npm install` (auto)

4. **Desplegar**
   - [ ] Click en "Deploy"
   - [ ] Esperar a que termine el build
   - [ ] Verificar que el despliegue fue exitoso

5. **Post-despliegue**
   - [ ] Verificar que la aplicación carga correctamente
   - [ ] Probar login/registro
   - [ ] Verificar que las funcionalidades principales funcionan
   - [ ] Configurar dominio personalizado (opcional)

### Opción 2: Con Vercel CLI

1. **Instalar CLI**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión**
   ```bash
   vercel login
   ```

3. **Desplegar**
   ```bash
   vercel
   ```

4. **Configurar variables de entorno**
   - Ir al dashboard de Vercel
   - Settings → Environment Variables
   - Agregar las variables necesarias

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Variables de Entorno en Producción

Configura estas variables en Vercel (Settings → Environment Variables):

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?schema=public
NEXT_PUBLIC_USE_MOCK_DATA=false
NODE_ENV=production
```

## Servicios de Base de Datos Recomendados

### Neon (Recomendado para empezar)
- URL: https://neon.tech
- Plan gratuito: 0.5 GB storage
- Pasos:
  1. Crear cuenta
  2. Crear proyecto
  3. Copiar connection string
  4. Agregar como `DATABASE_URL` en Vercel

### Supabase
- URL: https://supabase.com
- Plan gratuito: 500 MB database
- Incluye extras: Auth, Storage, Realtime

### Railway
- URL: https://railway.app
- Plan gratuito: $5 crédito/mes
- Muy fácil de usar

## Verificación Post-Despliegue

- [ ] La aplicación carga sin errores
- [ ] Login funciona correctamente
- [ ] Registro funciona correctamente
- [ ] Listado de lugares funciona
- [ ] Crear reservas funciona
- [ ] Dashboard de usuario funciona
- [ ] Dashboard de admin funciona
- [ ] Dashboard de owner funciona

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
**Solución**: Asegúrate de que `postinstall` script esté en package.json y que Prisma esté en devDependencies.

### Error: "Database connection failed"
**Solución**: 
- Verifica que `DATABASE_URL` esté configurada correctamente
- Verifica que la base de datos esté accesible desde internet
- Verifica que las credenciales sean correctas

### Error: "Build failed"
**Solución**:
- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en package.json
- Asegúrate de que no haya errores de TypeScript

### La app funciona pero no guarda datos
**Solución**: 
- Verifica que `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Verifica que `DATABASE_URL` esté configurada
- Verifica que las tablas existan en la base de datos

## Siguiente Paso

Una vez desplegado, puedes:
1. Continuar desarrollando nuevas funcionalidades
2. Configurar dominio personalizado
3. Configurar CI/CD para despliegues automáticos
4. Agregar monitoreo y analytics

