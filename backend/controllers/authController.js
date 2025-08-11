const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

class AuthController {
  static async registrar(req, res) {
    try {
      const { nombre, email, contraseña, telefono, fecha_nacimiento, genero, preferencias } = req.body;

      // Validar que el email no exista
      const usuarioExistente = await Usuario.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Crear usuario
      const usuario = await Usuario.crear({
        nombre,
        email,
        contraseña,
        telefono,
        fecha_nacimiento,
        genero,
        preferencias
      });

      // Generar token
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remover contraseña del response
      delete usuario.contraseña_hash;

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario,
        token
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async login(req, res) {
    try {
      const { email, contraseña } = req.body;

      // Buscar usuario
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const contraseñaValida = await Usuario.verificarContraseña(contraseña, usuario.contraseña_hash);
      if (!contraseñaValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remover contraseña del response
      delete usuario.contraseña_hash;

      res.json({
        mensaje: 'Login exitoso',
        usuario,
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerPerfil(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Remover contraseña del response
      delete usuario.contraseña_hash;

      res.json({ usuario });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async actualizarPerfil(req, res) {
    try {
      const { nombre, telefono, fecha_nacimiento, genero, preferencias } = req.body;
      
      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (telefono) datosActualizar.telefono = telefono;
      if (fecha_nacimiento) datosActualizar.fecha_nacimiento = fecha_nacimiento;
      if (genero) datosActualizar.genero = genero;
      if (preferencias) datosActualizar.preferencias = preferencias;

      const usuario = await Usuario.actualizar(req.usuario.id, datosActualizar);
      
      // Remover contraseña del response
      delete usuario.contraseña_hash;

      res.json({
        mensaje: 'Perfil actualizado exitosamente',
        usuario
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async cambiarContraseña(req, res) {
    try {
      const { contraseña_actual, nueva_contraseña } = req.body;

      // Obtener usuario actual
      const usuario = await Usuario.buscarPorId(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const contraseñaValida = await Usuario.verificarContraseña(contraseña_actual, usuario.contraseña_hash);
      if (!contraseñaValida) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
      }

      // Cambiar contraseña
      await Usuario.cambiarContraseña(req.usuario.id, nueva_contraseña);

      res.json({ mensaje: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async renovarToken(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Generar nuevo token
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Error renovando token:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = AuthController; 