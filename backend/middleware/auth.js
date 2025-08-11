const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.buscarPorId(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

const authOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.buscarPorId(decoded.id);
      
      if (usuario) {
        req.usuario = usuario;
      }
    }

    next();
  } catch (error) {
    // Si hay error en el token, continuar sin usuario
    next();
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.buscarPorId(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en autenticación admin:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { auth, authOpcional, authAdmin }; 