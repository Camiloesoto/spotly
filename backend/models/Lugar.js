const pool = require('../config/database');

class Lugar {
  static async crear({ nombre, tipo, direccion, descripcion, telefono, email, horarios, precio_promedio, capacidad, coordenadas, propietario_id }) {
    const id = require('uuid').v4();
    
    const query = `
      INSERT INTO lugares (id, nombre, tipo, direccion, descripcion, telefono, email, horarios, precio_promedio, capacidad, coordenadas, propietario_id, fecha_registro)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *
    `;
    
    const values = [id, nombre, tipo, direccion, descripcion, telefono, email, horarios, precio_promedio, capacidad, coordenadas, propietario_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = `
      SELECT l.*, 
             AVG(r.rating) as rating_promedio,
             COUNT(r.id) as total_resenas
      FROM lugares l
      LEFT JOIN resenas r ON l.id = r.lugar_id
      WHERE l.id = $1
      GROUP BY l.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async buscarTodos(filtros = {}) {
    let query = `
      SELECT l.*, 
             AVG(r.rating) as rating_promedio,
             COUNT(r.id) as total_resenas
      FROM lugares l
      LEFT JOIN resenas r ON l.id = r.lugar_id
    `;
    
    const whereConditions = [];
    const values = [];
    let valueIndex = 1;

    if (filtros.tipo) {
      whereConditions.push(`l.tipo = $${valueIndex}`);
      values.push(filtros.tipo);
      valueIndex++;
    }

    if (filtros.precio_min) {
      whereConditions.push(`l.precio_promedio >= $${valueIndex}`);
      values.push(filtros.precio_min);
      valueIndex++;
    }

    if (filtros.precio_max) {
      whereConditions.push(`l.precio_promedio <= $${valueIndex}`);
      values.push(filtros.precio_max);
      valueIndex++;
    }

    if (filtros.ubicacion) {
      // Comentado temporalmente hasta que PostGIS esté disponible
      // whereConditions.push(`ST_DWithin(l.coordenadas, ST_SetSRID(ST_MakePoint($${valueIndex}, $${valueIndex + 1}), 4326), 5000)`);
      // values.push(filtros.ubicacion.lng, filtros.ubicacion.lat);
      // valueIndex += 2;
      console.log('⚠️ Búsqueda por ubicación deshabilitada (PostGIS no disponible)');
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' GROUP BY l.id ORDER BY rating_promedio DESC NULLS LAST';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    
    const setClause = campos.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
    const query = `UPDATE lugares SET ${setClause}, fecha_actualizacion = NOW() WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...valores]);
    return result.rows[0];
  }

  static async obtenerHorarios(id) {
    const query = 'SELECT horarios FROM lugares WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0]?.horarios || {};
  }

  static async actualizarHorarios(id, horarios) {
    const query = 'UPDATE lugares SET horarios = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING horarios';
    const result = await pool.query(query, [horarios, id]);
    return result.rows[0];
  }

  static async obtenerMenu(id) {
    const query = 'SELECT * FROM menu_items WHERE lugar_id = $1 ORDER BY categoria, nombre';
    const result = await pool.query(query, [id]);
    return result.rows;
  }

  static async agregarMenuItem(lugar_id, item) {
    const id = require('uuid').v4();
    const query = `
      INSERT INTO menu_items (id, lugar_id, nombre, descripcion, precio, categoria, disponible)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [id, lugar_id, item.nombre, item.descripcion, item.precio, item.categoria, item.disponible];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async obtenerResenas(id) {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre
      FROM resenas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.lugar_id = $1
      ORDER BY r.fecha_creacion DESC
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  }

  static async obtenerDisponibilidad(id, fecha) {
    const query = `
      SELECT 
        l.capacidad,
        COALESCE(SUM(r.personas), 0) as reservas_actuales
      FROM lugares l
      LEFT JOIN reservas r ON l.id = r.lugar_id 
        AND DATE(r.fecha_hora) = $2
        AND r.estado != 'cancelada'
      WHERE l.id = $1
      GROUP BY l.capacidad
    `;
    const result = await pool.query(query, [id, fecha]);
    const lugar = result.rows[0];
    
    if (!lugar) return null;
    
    return {
      capacidad_total: lugar.capacidad,
      reservas_actuales: parseInt(lugar.reservas_actuales),
      disponibilidad: lugar.capacidad - parseInt(lugar.reservas_actuales)
    };
  }

  static async obtenerEstadisticas(id, periodo = 'mes') {
    let fechaInicio;
    switch (periodo) {
      case 'semana':
        fechaInicio = 'NOW() - INTERVAL \'7 days\'';
        break;
      case 'mes':
        fechaInicio = 'NOW() - INTERVAL \'1 month\'';
        break;
      case 'año':
        fechaInicio = 'NOW() - INTERVAL \'1 year\'';
        break;
      default:
        fechaInicio = 'NOW() - INTERVAL \'1 month\'';
    }

    const query = `
      SELECT 
        COUNT(*) as total_reservas,
        SUM(personas) as total_personas,
        AVG(personas) as promedio_personas,
        COUNT(DISTINCT usuario_id) as clientes_unicos
      FROM reservas 
      WHERE lugar_id = $1 
        AND fecha_hora >= ${fechaInicio}
        AND estado != 'cancelada'
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM lugares WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verificar(id) {
    const query = 'UPDATE lugares SET verificado = true, fecha_actualizacion = NOW() WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Lugar; 