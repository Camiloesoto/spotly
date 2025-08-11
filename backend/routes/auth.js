const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { 
  validarRegistro, 
  validarLogin, 
  validarCambiarContraseña 
} = require('../middleware/validation');

// POST /auth/registro
router.post('/registro', validarRegistro, AuthController.registrar);

// POST /auth/login
router.post('/login', validarLogin, AuthController.login);

// GET /auth/perfil
router.get('/perfil', auth, AuthController.obtenerPerfil);

// PUT /auth/perfil
router.put('/perfil', auth, AuthController.actualizarPerfil);

// PUT /auth/cambiar-contraseña
router.put('/cambiar-contraseña', auth, validarCambiarContraseña, AuthController.cambiarContraseña);

// POST /auth/renovar-token
router.post('/renovar-token', auth, AuthController.renovarToken);

module.exports = router; 