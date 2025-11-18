# Configuración de Base de Datos Local - PostgreSQL

## ✅ Verificación

Ya verificamos que tienes:
- ✅ PostgreSQL 17 instalado
- ✅ Servicio corriendo
- ✅ Prisma generado correctamente

## Paso 1: Crear Base de Datos

Abre PowerShell o CMD y ejecuta:

```bash
psql -U postgres -c "CREATE DATABASE seki;"
```

Si te pide contraseña, usa la que configuraste al instalar PostgreSQL.

**Alternativa:** Si no recuerdas la contraseña o hay problemas, puedes:
1. Abrir pgAdmin (si lo tienes instalado)
2. O usar un usuario diferente (si tienes uno configurado)

## Paso 2: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/seki?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

**Reemplaza:**
- `TU_CONTRASEÑA` con la contraseña de PostgreSQL
- Si usas otro usuario, cambia `postgres` por tu usuario

**Ejemplo:**
```env
DATABASE_URL="postgresql://postgres:mipassword123@localhost:5432/seki?schema=public"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NODE_ENV="development"
```

## Paso 3: Crear Tablas

```bash
npm run db:push
```

Esto creará todas las tablas en tu base de datos.

## Paso 4: Poblar con Datos de Prueba

```bash
npm run db:seed
```

Esto creará:
- Usuarios de prueba
- Solicitudes de restaurantes
- Lugares de ejemplo
- Reservas de ejemplo

## Paso 5: Verificar

### Opción A: Prisma Studio (GUI)

```bash
npm run db:studio
```

Abre http://localhost:5555 en tu navegador.

### Opción B: Probar la App

```bash
npm run dev
```

Luego:
1. Ve a http://localhost:3000
2. Login con: `admin@seki.com` / `admin123`
3. Verifica que todo funciona

## Usuarios de Prueba

Después de ejecutar `npm run db:seed`:

- **Admin**: `admin@seki.com` / `admin123`
- **Usuario**: `usuario@seki.com` / `usuario123`
- **Owner**: `maria.gonzalez@terraza.com` / `owner123`

## Troubleshooting

### Error: "password authentication failed"
- Verifica que la contraseña en `.env` sea correcta
- Si no recuerdas la contraseña, puedes resetearla o crear un nuevo usuario

### Error: "database does not exist"
- Ejecuta: `psql -U postgres -c "CREATE DATABASE seki;"`

### Error: "relation does not exist"
- Ejecuta: `npm run db:push`

