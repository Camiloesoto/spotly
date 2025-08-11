const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      detalles: errors.array() 
    });
  }
  next();
};

// Validaciones para registro de usuario
const validarRegistro = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone()
    .withMessage('Número de teléfono inválido'),
  body('fecha_nacimiento')
    .optional()
    .isISO8601()
    .withMessage('Fecha de nacimiento inválida'),
  body('genero')
    .optional()
    .isIn(['masculino', 'femenino', 'otro'])
    .withMessage('Género inválido'),
  handleValidationErrors
];

// Validaciones para login
const validarLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('contraseña')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Validaciones para crear lugar
const validarCrearLugar = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('tipo')
    .isIn(['restaurante', 'bar', 'cafe', 'discoteca', 'pub', 'pizzeria', 'sushi', 'italiano', 'mexicano', 'asiatico', 'vegetariano', 'vegano'])
    .withMessage('Tipo de lugar inválido'),
  body('direccion')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección debe tener entre 5 y 200 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone()
    .withMessage('Número de teléfono inválido'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('precio_promedio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio promedio debe ser un número positivo'),
  body('capacidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un número entero positivo'),
  body('coordenadas_lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  body('coordenadas_lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  handleValidationErrors
];

// Validaciones para actualizar lugar
const validarActualizarLugar = [
  param('id')
    .isUUID()
    .withMessage('ID de lugar inválido'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('tipo')
    .optional()
    .isIn(['restaurante', 'bar', 'cafe', 'discoteca', 'pub', 'pizzeria', 'sushi', 'italiano', 'mexicano', 'asiatico', 'vegetariano', 'vegano'])
    .withMessage('Tipo de lugar inválido'),
  body('direccion')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección debe tener entre 5 y 200 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone()
    .withMessage('Número de teléfono inválido'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('precio_promedio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio promedio debe ser un número positivo'),
  body('capacidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un número entero positivo'),
  body('coordenadas_lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  body('coordenadas_lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  handleValidationErrors
];

// Validaciones para crear reserva
const validarCrearReserva = [
  body('lugar_id')
    .isUUID()
    .withMessage('ID de lugar inválido'),
  body('fecha_hora')
    .isISO8601()
    .withMessage('Fecha y hora inválida'),
  body('personas')
    .isInt({ min: 1, max: 50 })
    .withMessage('El número de personas debe estar entre 1 y 50'),
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Las notas no pueden exceder 300 caracteres'),
  handleValidationErrors
];

// Validaciones para actualizar reserva
const validarActualizarReserva = [
  param('id')
    .isUUID()
    .withMessage('ID de reserva inválido'),
  body('fecha_hora')
    .optional()
    .isISO8601()
    .withMessage('Fecha y hora inválida'),
  body('personas')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('El número de personas debe estar entre 1 y 50'),
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Las notas no pueden exceder 300 caracteres'),
  handleValidationErrors
];

// Validaciones para búsqueda de lugares
const validarBuscarLugares = [
  query('tipo')
    .optional()
    .isIn(['restaurante', 'bar', 'cafe', 'discoteca', 'pub', 'pizzeria', 'sushi', 'italiano', 'mexicano', 'asiatico', 'vegetariano', 'vegano'])
    .withMessage('Tipo de lugar inválido'),
  query('precio_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Precio mínimo inválido'),
  query('precio_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Precio máximo inválido'),
  query('ubicacion_lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  query('ubicacion_lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  query('rating_min')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating mínimo debe estar entre 0 y 5'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe estar entre 1 y 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El offset debe ser un número entero no negativo'),
  handleValidationErrors
];

// Validaciones para parámetros UUID
const validarUUID = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  handleValidationErrors
];

// Validaciones para cambiar contraseña
const validarCambiarContraseña = [
  body('contraseña_actual')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('nueva_contraseña')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// Validaciones para agregar item al menú
const validarAgregarMenuItem = [
  param('id')
    .isUUID()
    .withMessage('ID de lugar inválido'),
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('categoria')
    .isIn(['entrada', 'plato_principal', 'postre', 'bebida', 'aperitivo', 'ensalada', 'sopa', 'pasta', 'carne', 'pescado', 'vegetariano'])
    .withMessage('Categoría inválida'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('La descripción no puede exceder 300 caracteres'),
  body('disponible')
    .optional()
    .isBoolean()
    .withMessage('Disponible debe ser true o false'),
  handleValidationErrors
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarCrearLugar,
  validarActualizarLugar,
  validarCrearReserva,
  validarActualizarReserva,
  validarBuscarLugares,
  validarUUID,
  validarCambiarContraseña,
  validarAgregarMenuItem,
  handleValidationErrors
}; 