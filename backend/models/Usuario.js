const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  static async crear({ nombre, email, contraseña, telefono, fecha_nacimiento, genero, preferencias }) {
    const id = require('uuid').v4();
    const contraseña_hash = await bcrypt.hash(contraseña, 10);
    
    const query = `
      INSERT INTO usuarios (id, nombre, email, contraseña_hash, telefono, fecha_nacimiento, genero, preferencias, fecha_registro)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, nombre, email, telefono, fecha_nacimiento, genero, preferencias, fecha_registro
    `;
    
    const values = [id, nombre, email, contraseña_hash, telefono, fecha_nacimiento, genero, preferencias];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    
    const setClause = campos.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
    const query = `UPDATE usuarios SET ${setClause}, fecha_actualizacion = NOW() WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...valores]);
    return result.rows[0];
  }

  static async cambiarContraseña(id, nuevaContraseña) {
    const contraseña_hash = await bcrypt.hash(nuevaContraseña, 10);
    const query = 'UPDATE usuarios SET contraseña_hash = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING id';
    const result = await pool.query(query, [contraseña_hash, id]);
    return result.rows[0];
  }

  static async verificarContraseña(contraseña, contraseña_hash) {
    return await bcrypt.compare(contraseña, contraseña_hash);
  }

  static async obtenerFavoritos(id) {
    const query = `
      SELECT l.* FROM lugares l
      INNER JOIN favoritos f ON l.id = f.lugar_id
      WHERE f.usuario_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  }

  static async agregarFavorito(usuario_id, lugar_id) {
    const query = 'INSERT INTO favoritos (usuario_id, lugar_id, fecha) VALUES ($1, $2, NOW())';
    await pool.query(query, [usuario_id, lugar_id]);
  }

  static async removerFavorito(usuario_id, lugar_id) {
    const query = 'DELETE FROM favoritos WHERE usuario_id = $1 AND lugar_id = $2';
    await pool.query(query, [usuario_id, lugar_id]);
  }

  static async obtenerReservas(id) {
    const query = `
      SELECT r.*, l.nombre as lugar_nombre, l.direccion, l.tipo
      FROM reservas r
      INNER JOIN lugares l ON r.lugar_id = l.id
      WHERE r.usuario_id = $1
      ORDER BY r.fecha_hora DESC
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  }

  static async obtenerHistorial(id) {
    const query = `
      SELECT r.*, l.nombre as lugar_nombre, l.direccion, l.tipo
      FROM reservas r
      INNER JOIN lugares l ON r.lugar_id = l.id
      WHERE r.usuario_id = $1 AND r.fecha_hora < NOW()
      ORDER BY r.fecha_hora DESC
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  }
}

module.exports = Usuario; 