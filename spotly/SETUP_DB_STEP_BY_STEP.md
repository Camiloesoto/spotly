# Configuración de Base de Datos - Paso a Paso

## Paso 1: Elegir Base de Datos en la Nube

Te recomiendo **Neon** porque es el más fácil y gratuito. Alternativas: Supabase, Railway.

### Opción Recomendada: Neon

1. Ve a https://neon.tech
2. Crea cuenta (puedes usar GitHub)
3. Click en "Create Project"
4. Nombre: `seki` (o el que prefieras)
5. Región: Elige la más cercana
6. Click "Create Project"

### Obtener Connection String

1. En el dashboard de Neon, verás "Connection string"
2. Copia la string completa (empieza con `postgresql://...`)
3. **Guárdala**, la necesitarás en el siguiente paso

---

## Paso 2: Instalar Prisma (si no está instalado)

Si tienes espacio en disco, ejecuta:

```bash
npm install
```

Esto instalará Prisma y todas las dependencias.

**Si no tienes espacio**, puedes saltar este paso y configurar la base de datos primero. La app funcionará con mock data hasta que instales Prisma.

---

## Paso 3: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`):

```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/database?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

**Reemplaza** `DATABASE_URL` con la connection string que copiaste de Neon.

**Ejemplo:**
```env
DATABASE_URL="postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

---

## Paso 4: Generar Cliente Prisma

```bash
npm run db:generate
```

Esto crea el cliente de Prisma basado en tu schema.

---

## Paso 5: Crear Tablas en la Base de Datos

```bash
npm run db:push
```

Esto crea todas las tablas en tu base de datos PostgreSQL.

**Verás algo como:**
```
✔ Generated Prisma Client
✔ Pushed database schema
```

---

## Paso 6: Poblar con Datos de Prueba (Opcional)

```bash
npm run db:seed
```

Esto crea:
- Usuarios de prueba
- Solicitudes de restaurantes
- Lugares de ejemplo
- Reservas de ejemplo

---

## Paso 7: Verificar que Funciona

### Opción A: Prisma Studio (GUI)

```bash
npm run db:studio
```

Abre http://localhost:5555 y verás todas las tablas con datos.

### Opción B: Probar la App

```bash
npm run dev
```

Luego:
1. Ve a http://localhost:3000
2. Login con: `admin@seki.com` / `admin123`
3. Verifica que todo funciona

---

## Comandos Rápidos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear/actualizar tablas
npm run db:push

# Crear migraciones (producción)
npm run db:migrate

# Ver datos en navegador
npm run db:studio

# Poblar con datos de prueba
npm run db:seed
```

---

## Si Algo Sale Mal

### Error: "Can't reach database server"
- Verifica que la `DATABASE_URL` sea correcta
- Verifica que copiaste toda la string (incluye `?sslmode=require`)

### Error: "Prisma Client not generated"
- Ejecuta: `npm run db:generate`

### Error: "relation does not exist"
- Ejecuta: `npm run db:push`

### Error: "Module not found: @prisma/client"
- Ejecuta: `npm install`

---

## Usuarios de Prueba (después de seed)

- **Admin**: `admin@seki.com` / `admin123`
- **Usuario**: `usuario@seki.com` / `usuario123`
- **Owner**: `maria.gonzalez@terraza.com` / `owner123`

---

## Siguiente Paso

Una vez configurada la base de datos:
1. ✅ Prueba localmente
2. ✅ Configura variables en Vercel
3. ✅ Despliega

