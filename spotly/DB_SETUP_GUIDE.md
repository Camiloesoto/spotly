# Guía de Configuración de Base de Datos - Seki

## Opciones de Base de Datos

### Opción 1: Neon (Recomendado - Más fácil)

**Ventajas:**
- ✅ Gratis para empezar (0.5 GB)
- ✅ Serverless PostgreSQL
- ✅ Muy fácil de configurar
- ✅ Connection pooling incluido

**Pasos:**

1. **Crear cuenta y proyecto**
   - Ve a https://neon.tech
   - Crea una cuenta (puedes usar GitHub)
   - Crea un nuevo proyecto
   - Selecciona la región más cercana

2. **Obtener connection string**
   - En el dashboard, ve a "Connection Details"
   - Copia la "Connection string" (formato: `postgresql://user:password@host/database?sslmode=require`)

3. **Configurar en el proyecto**
   - Crea archivo `.env` en la raíz
   - Agrega: `DATABASE_URL="tu_connection_string_aqui"`
   - Agrega: `NEXT_PUBLIC_USE_MOCK_DATA="false"`

4. **Inicializar base de datos**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

### Opción 2: Supabase

**Ventajas:**
- ✅ Gratis (500 MB database)
- ✅ Incluye Auth, Storage, Realtime
- ✅ Dashboard completo

**Pasos:**

1. **Crear proyecto**
   - Ve a https://supabase.com
   - Crea cuenta y proyecto
   - Espera a que termine de crear (2-3 minutos)

2. **Obtener connection string**
   - Ve a Settings → Database
   - En "Connection string", selecciona "URI"
   - Copia la connection string
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña de base de datos

3. **Configurar en el proyecto**
   - Crea archivo `.env` en la raíz
   - Agrega: `DATABASE_URL="tu_connection_string_aqui"`
   - Agrega: `NEXT_PUBLIC_USE_MOCK_DATA="false"`

4. **Inicializar base de datos**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

### Opción 3: Railway

**Ventajas:**
- ✅ $5 crédito gratis/mes
- ✅ Muy fácil de usar
- ✅ Deploy automático

**Pasos:**

1. **Crear proyecto**
   - Ve a https://railway.app
   - Crea cuenta con GitHub
   - Click en "New Project"
   - Selecciona "Database" → "PostgreSQL"

2. **Obtener connection string**
   - Click en la base de datos
   - Ve a "Variables"
   - Copia `DATABASE_URL`

3. **Configurar en el proyecto**
   - Crea archivo `.env` en la raíz
   - Agrega: `DATABASE_URL="tu_connection_string_aqui"`
   - Agrega: `NEXT_PUBLIC_USE_MOCK_DATA="false"`

4. **Inicializar base de datos**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

### Opción 4: PostgreSQL Local

**Solo si tienes PostgreSQL instalado localmente**

1. **Crear base de datos**
   ```bash
   createdb seki
   ```

2. **Configurar .env**
   ```env
   DATABASE_URL="postgresql://tu_usuario:tu_contraseña@localhost:5432/seki?schema=public"
   NEXT_PUBLIC_USE_MOCK_DATA="false"
   ```

3. **Inicializar**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

## Pasos Comunes (Después de elegir opción)

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/database?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

### 2. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3. Generar cliente Prisma

```bash
npm run db:generate
```

Esto crea el cliente de Prisma basado en tu schema.

### 4. Crear tablas en la base de datos

**Opción A: db:push (desarrollo - rápido)**
```bash
npm run db:push
```

**Opción B: db:migrate (producción - recomendado)**
```bash
npm run db:migrate
```

### 5. Poblar con datos de prueba (opcional)

```bash
npm run db:seed
```

Esto crea:
- Usuarios de prueba (admin, usuarios, owners)
- Solicitudes de restaurantes
- Lugares de ejemplo
- Reservas de ejemplo

### 6. Verificar que funciona

```bash
npm run dev
```

Prueba:
- Login con `admin@seki.com` / `admin123`
- Ver lugares
- Crear reservas

---

## Verificar Conexión

### Opción 1: Prisma Studio (GUI)

```bash
npm run db:studio
```

Abre http://localhost:5555 en tu navegador para ver y editar datos.

### Opción 2: Desde código

Crea un script temporal `test-db.ts`:

```typescript
import { getPrismaClient } from "./src/lib/prisma";

async function test() {
  const prisma = await getPrismaClient();
  if (!prisma) {
    console.log("❌ Prisma no está disponible");
    return;
  }
  
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Conexión exitosa!");
    console.log(`Usuarios encontrados: ${users.length}`);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
}

test();
```

Ejecuta: `npx tsx test-db.ts`

---

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que la `DATABASE_URL` sea correcta
- Verifica que la base de datos esté accesible desde internet (si es en la nube)
- Verifica firewall/red

### Error: "relation does not exist"
- Ejecuta `npm run db:push` para crear las tablas

### Error: "password authentication failed"
- Verifica usuario y contraseña en `DATABASE_URL`
- Si es Supabase, usa la contraseña que configuraste al crear el proyecto

### Error: "Prisma Client not generated"
- Ejecuta `npm run db:generate`

---

## Usuarios de Prueba (después de seed)

Después de ejecutar `npm run db:seed`, puedes usar:

- **Admin**: `admin@seki.com` / `admin123`
- **Usuario**: `usuario@seki.com` / `usuario123`
- **Owner**: `maria.gonzalez@terraza.com` / `owner123`

---

## Siguiente Paso

Una vez configurada la base de datos:
1. ✅ Prueba la aplicación localmente
2. ✅ Configura variables de entorno en Vercel
3. ✅ Despliega la aplicación

