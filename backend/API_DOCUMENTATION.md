# 📚 Documentación de la API Spotly

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token>
```

## 📋 Endpoints

### 🔑 Autenticación

#### 1. Registrar Usuario
```http
POST /auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "password123",
  "telefono": "+573001234567",
  "fecha_nacimiento": "1990-01-01",
  "genero": "masculino",
  "preferencias": {
    "tipos_comida": ["italiano", "mexicano"],
    "precio_max": 50000
  }
}
```

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+573001234567",
    "fecha_registro": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_aqui"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contraseña": "password123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "jwt_token_aqui"
}
```

#### 3. Obtener Perfil
```http
GET /auth/perfil
Authorization: Bearer <token>
```

#### 4. Actualizar Perfil
```http
PUT /auth/perfil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "telefono": "+573001234568",
  "preferencias": {
    "tipos_comida": ["italiano", "mexicano", "asiatico"]
  }
}
```

### 🏪 Lugares

#### 1. Buscar Lugares
```http
GET /lugares?tipo=restaurante&precio_min=20000&precio_max=50000&limit=10&offset=0
```

**Parámetros opcionales:**
- `tipo`: restaurante, bar, cafe, discoteca, pub, pizzeria, sushi, italiano, mexicano, asiatico, vegetariano, vegano
- `precio_min`: precio mínimo
- `precio_max`: precio máximo
- `ubicacion_lat`: latitud para búsqueda cercana
- `ubicacion_lng`: longitud para búsqueda cercana
- `rating_min`: rating mínimo (1-5)
- `limit`: número de resultados (1-100)
- `offset`: offset para paginación

#### 2. Buscar Lugares Cercanos
```http
GET /lugares/cercanos?lat=4.7110&lng=-74.0721&radio=5000
```

#### 3. Obtener Lugar Específico
```http
GET /lugares/{id}
```

**Respuesta incluye:**
- Información del lugar
- Menú completo
- Reseñas y calificaciones
- Horarios
- Disponibilidad

#### 4. Verificar Disponibilidad
```http
GET /lugares/{id}/disponibilidad?fecha=2024-01-15
```

#### 5. Obtener Menú
```http
GET /lugares/{id}/menu
```

#### 6. Obtener Reseñas
```http
GET /lugares/{id}/resenas?limit=10&offset=0
```

#### 7. Crear Lugar (Propietarios)
```http
POST /lugares
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Mi Restaurante",
  "tipo": "restaurante",
  "direccion": "Calle 123 #45-67, Bogotá",
  "descripcion": "El mejor restaurante de la zona",
  "telefono": "+571234567890",
  "email": "info@mirestaurante.com",
  "precio_promedio": 35000,
  "capacidad": 50,
  "coordenadas_lat": 4.7110,
  "coordenadas_lng": -74.0721,
  "horarios": {
    "lunes": {"abierto": true, "inicio": "12:00", "fin": "22:00"},
    "martes": {"abierto": true, "inicio": "12:00", "fin": "22:00"},
    "miercoles": {"abierto": true, "inicio": "12:00", "fin": "22:00"},
    "jueves": {"abierto": true, "inicio": "12:00", "fin": "23:00"},
    "viernes": {"abierto": true, "inicio": "12:00", "fin": "23:00"},
    "sabado": {"abierto": true, "inicio": "12:00", "fin": "23:00"},
    "domingo": {"abierto": false}
  }
}
```

#### 8. Agregar Item al Menú
```http
POST /lugares/{id}/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Pasta Carbonara",
  "descripcion": "Pasta con salsa cremosa, panceta y queso parmesano",
  "precio": 25000,
  "categoria": "plato_principal",
  "disponible": true
}
```

### 📅 Reservas

#### 1. Crear Reserva
```http
POST /reservas
Authorization: Bearer <token>
Content-Type: application/json

{
  "lugar_id": "uuid_del_lugar",
  "fecha_hora": "2024-01-15T19:00:00.000Z",
  "personas": 4,
  "notas": "Mesa cerca de la ventana por favor"
}
```

#### 2. Crear Reserva Grupal
```http
POST /reservas/grupal
Authorization: Bearer <token>
Content-Type: application/json

{
  "lugar_id": "uuid_del_lugar",
  "fecha_hora": "2024-01-15T19:00:00.000Z",
  "personas": 6,
  "notas": "Celebración de cumpleaños",
  "invitados": [
    {"usuario_id": "uuid_invitado1", "confirmado": true},
    {"usuario_id": "uuid_invitado2", "confirmado": false}
  ]
}
```

#### 3. Obtener Reservas del Usuario
```http
GET /reservas/usuario?estado=confirmada
```

**Estados posibles:** confirmada, cancelada, completada

#### 4. Obtener Reserva Específica
```http
GET /reservas/{id}
Authorization: Bearer <token>
```

#### 5. Actualizar Reserva
```http
PUT /reservas/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "fecha_hora": "2024-01-15T20:00:00.000Z",
  "personas": 5,
  "notas": "Actualización de notas"
}
```

#### 6. Cancelar Reserva
```http
DELETE /reservas/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "motivo": "Cambio de planes"
}
```

#### 7. Verificar Disponibilidad
```http
GET /reservas/lugar/{lugar_id}/disponibilidad?fecha_hora=2024-01-15T19:00:00.000Z&personas=4
```

## 🧪 Ejemplos de Testing

### Usando cURL

#### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "contraseña": "password123",
    "telefono": "+573001234567"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "contraseña": "password123"
  }'
```

#### 3. Buscar Lugares
```bash
curl -X GET "http://localhost:3000/api/lugares?tipo=restaurante&limit=5"
```

#### 4. Crear Reserva (con token)
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "lugar_id": "UUID_DEL_LUGAR",
    "fecha_hora": "2024-01-15T19:00:00.000Z",
    "personas": 2
  }'
```

### Usando Postman

1. **Importar colección** (crear colección con los endpoints)
2. **Configurar variables de entorno:**
   - `base_url`: `http://localhost:3000/api`
   - `token`: (se obtiene del login)

3. **Flujo de testing:**
   - Registrar usuario → obtener token
   - Login → obtener token
   - Buscar lugares → obtener IDs
   - Crear reserva → verificar respuesta
   - Obtener reservas del usuario → verificar lista

## 📊 Códigos de Respuesta

- `200` - OK
- `201` - Creado exitosamente
- `400` - Error en datos de entrada
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## 🔍 Validaciones

### Usuarios
- Email debe ser válido y único
- Contraseña mínimo 6 caracteres
- Teléfono opcional pero debe ser válido
- Fecha de nacimiento en formato ISO

### Lugares
- Nombre entre 2-100 caracteres
- Tipo debe ser uno de los valores permitidos
- Dirección entre 5-200 caracteres
- Precio promedio debe ser positivo
- Coordenadas opcionales pero válidas

### Reservas
- Fecha/hora debe ser futura
- Personas entre 1-50
- Lugar debe existir y estar activo
- Verificar disponibilidad antes de crear

## 🚀 Próximos Endpoints

- `POST /resenas` - Crear reseña
- `GET /usuarios/favoritos` - Obtener favoritos
- `POST /usuarios/favoritos` - Agregar favorito
- `DELETE /usuarios/favoritos/{id}` - Remover favorito
- `GET /notificaciones` - Obtener notificaciones
- `PUT /notificaciones/{id}/leer` - Marcar como leída

---

**Nota:** Esta documentación se actualiza constantemente. Para la versión más reciente, consulta el código fuente. 