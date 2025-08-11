const pool = require('../config/database');

const crearTablas = async () => {
  try {
    console.log('🔄 Iniciando migración de base de datos...');

    // Eliminar tabla usuarios si existe para recrearla correctamente
    await pool.query('DROP TABLE IF EXISTS usuarios CASCADE');
    
    // Crear tabla de usuarios
    await pool.query(`
      CREATE TABLE usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        contraseña_hash VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        fecha_nacimiento DATE,
        genero VARCHAR(20),
        preferencias JSONB,
        rol VARCHAR(20) DEFAULT 'usuario',
        fecha_registro TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla usuarios creada');

    // Eliminar tabla lugares si existe
    await pool.query('DROP TABLE IF EXISTS lugares CASCADE');
    
    // Crear tabla de lugares
    await pool.query(`
      CREATE TABLE lugares (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(200) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        direccion TEXT NOT NULL,
        descripcion TEXT,
        telefono VARCHAR(20),
        email VARCHAR(255),
        horarios JSONB,
        precio_promedio DECIMAL(10,2) DEFAULT 0,
        capacidad INTEGER DEFAULT 0,
        coordenadas TEXT, -- Cambiado de GEOGRAPHY(POINT) a TEXT para compatibilidad
        propietario_id UUID REFERENCES usuarios(id),
        activo BOOLEAN DEFAULT true,
        fecha_registro TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla lugares creada');

    // Eliminar tabla reservas si existe
    await pool.query('DROP TABLE IF EXISTS reservas CASCADE');
    
    // Crear tabla de reservas
    await pool.query(`
      CREATE TABLE reservas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        lugar_id UUID NOT NULL REFERENCES lugares(id),
        fecha_hora TIMESTAMP NOT NULL,
        personas INTEGER NOT NULL,
        notas TEXT,
        estado VARCHAR(20) DEFAULT 'confirmada',
        motivo_cancelacion TEXT,
        fecha_creacion TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla reservas creada');

    // Crear tabla de menú items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id UUID NOT NULL REFERENCES lugares(id),
        nombre VARCHAR(200) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        disponible BOOLEAN DEFAULT true,
        imagen_url VARCHAR(500),
        fecha_creacion TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla menu_items creada');

    // Crear tabla de reseñas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resenas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        lugar_id UUID NOT NULL REFERENCES lugares(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comentario TEXT,
        fecha_creacion TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW(),
        UNIQUE(usuario_id, lugar_id)
      )
    `);
    console.log('✅ Tabla resenas creada');

    // Crear tabla de favoritos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        lugar_id UUID NOT NULL REFERENCES lugares(id),
        fecha TIMESTAMP DEFAULT NOW(),
        UNIQUE(usuario_id, lugar_id)
      )
    `);
    console.log('✅ Tabla favoritos creada');

    // Crear tabla de invitados de reservas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reserva_invitados (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reserva_id UUID NOT NULL REFERENCES reservas(id),
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        confirmado BOOLEAN DEFAULT false,
        fecha_invitacion TIMESTAMP DEFAULT NOW(),
        fecha_respuesta TIMESTAMP
      )
    `);
    console.log('✅ Tabla reserva_invitados creada');

    // Crear tabla de imágenes de lugares
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lugar_imagenes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lugar_id UUID NOT NULL REFERENCES lugares(id),
        url VARCHAR(500) NOT NULL,
        tipo VARCHAR(20) DEFAULT 'general',
        orden INTEGER DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla lugar_imagenes creada');

    // Crear tabla de notificaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id),
        tipo VARCHAR(50) NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        mensaje TEXT NOT NULL,
        leida BOOLEAN DEFAULT false,
        datos JSONB,
        fecha_creacion TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla notificaciones creada');

    // Crear índices para mejorar rendimiento
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_lugares_tipo ON lugares(tipo)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha_hora)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reservas_lugar ON reservas(lugar_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_resenas_lugar ON resenas(lugar_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id)');
    
    // Crear índice geográfico solo si PostGIS está disponible
    try {
      await pool.query('CREATE INDEX IF NOT EXISTS idx_lugares_coordenadas ON lugares USING GIST(coordenadas)');
      console.log('✅ Índice geográfico creado (PostGIS)');
    } catch (error) {
      console.log('⚠️ Índice geográfico no creado (PostGIS no disponible)');
    }

    console.log('✅ Índices creados');

    // Insertar datos de ejemplo
    await insertarDatosEjemplo();

    console.log('🎉 Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  }
};

const insertarDatosEjemplo = async () => {
  try {
    console.log('📝 Insertando datos de ejemplo...');

    // Insertar usuarios de ejemplo
    const usuarios = [
      {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        contraseña_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        telefono: '+573001234567',
        rol: 'usuario'
      },
      {
        nombre: 'María García',
        email: 'maria@example.com',
        contraseña_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        telefono: '+573007654321',
        rol: 'usuario'
      },
      {
        nombre: 'Carlos López',
        email: 'carlos@example.com',
        contraseña_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        telefono: '+573001112223',
        rol: 'usuario'
      },
      {
        nombre: 'Admin Spotly',
        email: 'admin@spotly.com',
        contraseña_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        telefono: '+573001112224',
        rol: 'admin'
      }
    ];

    for (const usuario of usuarios) {
      await pool.query(`
        INSERT INTO usuarios (nombre, email, contraseña_hash, telefono, rol)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, [usuario.nombre, usuario.email, usuario.contraseña_hash, usuario.telefono, usuario.rol]);
    }

    // Insertar lugares de ejemplo
    const lugares = [
      {
        nombre: 'Restaurante La Parrilla',
        tipo: 'restaurante',
        direccion: 'Calle 123 #45-67, Bogotá',
        descripcion: 'El mejor restaurante de parrilla en Bogotá',
        telefono: '+571234567890',
        precio_promedio: 45000,
        capacidad: 80,
        coordenadas: 'POINT(-74.0721 4.7110)'
      },
      {
        nombre: 'Café Central',
        tipo: 'cafe',
        direccion: 'Carrera 15 #93-47, Bogotá',
        descripcion: 'Café de especialidad con ambiente acogedor',
        telefono: '+571234567891',
        precio_promedio: 25000,
        capacidad: 40,
        coordenadas: 'POINT(-74.0721 4.7110)'
      },
      {
        nombre: 'Bar El Rincón',
        tipo: 'bar',
        direccion: 'Calle 85 #12-34, Bogotá',
        descripcion: 'Bar tradicional con música en vivo',
        telefono: '+571234567892',
        precio_promedio: 35000,
        capacidad: 60,
        coordenadas: 'POINT(-74.0721 4.7110)'
      }
    ];

          for (const lugar of lugares) {
        await pool.query(`
          INSERT INTO lugares (nombre, tipo, direccion, descripcion, telefono, precio_promedio, capacidad, coordenadas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING
        `, [lugar.nombre, lugar.tipo, lugar.direccion, lugar.descripcion, lugar.telefono, lugar.precio_promedio, lugar.capacidad, lugar.coordenadas]);
      }

    console.log('✅ Datos de ejemplo insertados');
  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error);
  }
};

// Ejecutar migración si se ejecuta directamente
if (require.main === module) {
  crearTablas()
    .then(() => {
      console.log('✅ Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { crearTablas }; 