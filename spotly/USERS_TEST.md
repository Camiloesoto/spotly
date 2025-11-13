# Usuarios de Prueba

Este documento lista todos los usuarios de prueba disponibles en el sistema para desarrollo y testing.

## Administrador

| Email | Contraseña | Nombre | Rol |
|-------|------------|--------|-----|
| `admin@seki.com` | `admin123` | Administrador Seki | admin |

**Funcionalidades:**
- Acceso al panel administrativo (`/admin`)
- Revisar y gestionar solicitudes de restaurantes (`/admin/requests`)
- Ver métricas y estadísticas

---

## Usuarios Regulares

| Email | Contraseña | Nombre | Rol |
|-------|------------|--------|-----|
| `usuario@seki.com` | `usuario123` | Juan Pérez | user |
| `maria@seki.com` | `maria123` | María Rodríguez | user |
| `carlos@seki.com` | `carlos123` | Carlos Martínez | user |

**Funcionalidades:**
- Explorar lugares (`/places`)
- Ver detalles de restaurantes
- Crear reservas
- Ver y cancelar sus reservas (`/user`)
- Editar perfil (`/user/profile`)

---

## Usuarios Owner (Dueños de Restaurantes)

### Owner con solicitud pendiente

| Email | Contraseña | Nombre | Estado de Solicitud |
|-------|------------|--------|---------------------|
| `maria.gonzalez@terraza.com` | `owner123` | María González | Pendiente de revisión |
| `carlos.ramirez@rincon.com` | `owner123` | Carlos Ramírez | Pendiente de revisión |

**Solicitudes asociadas:**
- **María González**: "La Terraza del Valle" (restaurante, alta gama)
- **Carlos Ramírez**: "Bar El Rincón" (bar, precio medio)

### Owner con solicitud pre-aprobada

| Email | Contraseña | Nombre | Estado de Solicitud |
|-------|------------|--------|---------------------|
| `andres.lopez@neon.com` | `owner123` | Andrés López | Pre-aprobada |

**Solicitud asociada:**
- **Andrés López**: "Discoteca Neon" (discoteca, alta gama)

**Próximos pasos:**
- Completar perfil del restaurante
- Enviar para revisión final

### Owner sin solicitud

| Email | Contraseña | Nombre | Estado |
|-------|------------|--------|--------|
| `nuevo.owner@seki.com` | `owner123` | Nuevo Owner | Sin solicitud |

**Funcionalidades:**
- Puede enviar una nueva solicitud desde `/places/new`
- Verá el prompt de registro en el dashboard (`/owner`)

---

## Flujos de Prueba Recomendados

### 1. Flujo de Solicitud de Restaurante
1. Iniciar sesión como `nuevo.owner@seki.com` / `owner123`
2. Ir a `/places/new` y completar el formulario
3. Enviar la solicitud
4. Iniciar sesión como `admin@seki.com` / `admin123`
5. Ir a `/admin/requests` y revisar la solicitud
6. Pre-aprobar o rechazar la solicitud
7. Volver a iniciar sesión como owner y ver el estado actualizado

### 2. Flujo de Usuario Regular
1. Iniciar sesión como `usuario@seki.com` / `usuario123`
2. Explorar lugares en `/places`
3. Ver detalles de un lugar
4. Crear una reserva
5. Ver reservas en `/user`
6. Editar perfil en `/user/profile`

### 3. Flujo de Admin
1. Iniciar sesión como `admin@seki.com` / `admin123`
2. Ver dashboard en `/admin`
3. Revisar solicitudes en `/admin/requests`
4. Pre-aprobar o rechazar solicitudes
5. Ver métricas y estadísticas

---

## Notas

- Todas las contraseñas son simples para facilitar las pruebas
- Los usuarios owner con solicitudes pendientes verán el estado en su dashboard
- Los usuarios owner pre-aprobados pueden completar su perfil
- Los datos son mock y se resetean al recargar la página (en desarrollo)

