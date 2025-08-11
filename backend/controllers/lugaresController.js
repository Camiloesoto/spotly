const Lugar = require('../models/Lugar');
const Reserva = require('../models/Reserva');

class LugaresController {
  static async buscarLugares(req, res) {
    try {
      const {
        tipo,
        precio_min,
        precio_max,
        ubicacion_lat,
        ubicacion_lng,
        rating_min,
        distancia_max,
        limit = 20,
        offset = 0
      } = req.query;

      const filtros = {};
      
      if (tipo) filtros.tipo = tipo;
      if (precio_min) filtros.precio_min = parseFloat(precio_min);
      if (precio_max) filtros.precio_max = parseFloat(precio_max);
      if (ubicacion_lat && ubicacion_lng) {
        filtros.ubicacion = {
          lat: parseFloat(ubicacion_lat),
          lng: parseFloat(ubicacion_lng)
        };
      }

      const lugares = await Lugar.buscarTodos(filtros);
      
      // Filtrar por rating si se especifica
      let lugaresFiltrados = lugares;
      if (rating_min) {
        lugaresFiltrados = lugares.filter(lugar => 
          lugar.rating_promedio >= parseFloat(rating_min)
        );
      }

      // Aplicar paginación
      const lugaresPaginados = lugaresFiltrados.slice(offset, offset + parseInt(limit));

      res.json({
        lugares: lugaresPaginados,
        total: lugaresFiltrados.length,
        pagina: Math.floor(offset / limit) + 1,
        total_paginas: Math.ceil(lugaresFiltrados.length / limit)
      });
    } catch (error) {
      console.error('Error buscando lugares:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerLugar(req, res) {
    try {
      const { id } = req.params;
      const lugar = await Lugar.buscarPorId(id);
      
      if (!lugar) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      // Obtener menú del lugar
      const menu = await Lugar.obtenerMenu(id);
      
      // Obtener reseñas del lugar
      const resenas = await Lugar.obtenerResenas(id);

      res.json({
        lugar: {
          ...lugar,
          menu,
          resenas
        }
      });
    } catch (error) {
      console.error('Error obteniendo lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerDisponibilidad(req, res) {
    try {
      const { id } = req.params;
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({ error: 'La fecha es requerida' });
      }

      const disponibilidad = await Lugar.obtenerDisponibilidad(id, fecha);
      
      if (!disponibilidad) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      res.json({ disponibilidad });
    } catch (error) {
      console.error('Error obteniendo disponibilidad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerHorarios(req, res) {
    try {
      const { id } = req.params;
      const horarios = await Lugar.obtenerHorarios(id);
      
      res.json({ horarios });
    } catch (error) {
      console.error('Error obteniendo horarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerMenu(req, res) {
    try {
      const { id } = req.params;
      const menu = await Lugar.obtenerMenu(id);
      
      res.json({ menu });
    } catch (error) {
      console.error('Error obteniendo menú:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerResenas(req, res) {
    try {
      const { id } = req.params;
      const { limit = 10, offset = 0 } = req.query;
      
      const resenas = await Lugar.obtenerResenas(id);
      
      // Aplicar paginación
      const resenasPaginadas = resenas.slice(offset, offset + parseInt(limit));

      res.json({
        resenas: resenasPaginadas,
        total: resenas.length,
        pagina: Math.floor(offset / limit) + 1,
        total_paginas: Math.ceil(resenas.length / limit)
      });
    } catch (error) {
      console.error('Error obteniendo reseñas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async crearLugar(req, res) {
    try {
      const {
        nombre,
        tipo,
        direccion,
        descripcion,
        telefono,
        email,
        horarios,
        precio_promedio,
        capacidad,
        coordenadas_lat,
        coordenadas_lng,
        propietario_id
      } = req.body;

      // Validar datos requeridos
      if (!nombre || !tipo || !direccion) {
        return res.status(400).json({ error: 'Nombre, tipo y dirección son requeridos' });
      }

      const coordenadas = coordenadas_lat && coordenadas_lng 
        ? `POINT(${coordenadas_lng} ${coordenadas_lat})`
        : null;

      const lugar = await Lugar.crear({
        nombre,
        tipo,
        direccion,
        descripcion,
        telefono,
        email,
        horarios,
        precio_promedio: parseFloat(precio_promedio) || 0,
        capacidad: parseInt(capacidad) || 0,
        coordenadas,
        propietario_id
      });

      res.status(201).json({
        mensaje: 'Lugar creado exitosamente',
        lugar
      });
    } catch (error) {
      console.error('Error creando lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async actualizarLugar(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;

      // Verificar que el lugar existe
      const lugarExistente = await Lugar.buscarPorId(id);
      if (!lugarExistente) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      const lugar = await Lugar.actualizar(id, datos);

      res.json({
        mensaje: 'Lugar actualizado exitosamente',
        lugar
      });
    } catch (error) {
      console.error('Error actualizando lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async agregarMenuItem(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, categoria, disponible = true } = req.body;

      // Validar datos requeridos
      if (!nombre || !precio || !categoria) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
      }

      const menuItem = await Lugar.agregarMenuItem(id, {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        disponible
      });

      res.status(201).json({
        mensaje: 'Item agregado al menú exitosamente',
        menuItem
      });
    } catch (error) {
      console.error('Error agregando item al menú:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerEstadisticas(req, res) {
    try {
      const { id } = req.params;
      const { periodo = 'mes' } = req.query;

      const estadisticas = await Lugar.obtenerEstadisticas(id, periodo);

      res.json({ estadisticas });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async buscarLugaresCercanos(req, res) {
    try {
      const { lat, lng, radio = 5000 } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
      }

      const filtros = {
        ubicacion: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      };

      const lugares = await Lugar.buscarTodos(filtros);

      res.json({
        lugares,
        total: lugares.length,
        ubicacion: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radio: parseInt(radio)
      });
    } catch (error) {
      console.error('Error buscando lugares cercanos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async eliminarLugar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el lugar existe
      const lugarExistente = await Lugar.buscarPorId(id);
      if (!lugarExistente) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      await Lugar.eliminar(id);

      res.json({ mensaje: 'Lugar eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async verificarLugar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el lugar existe
      const lugarExistente = await Lugar.buscarPorId(id);
      if (!lugarExistente) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      const lugarVerificado = await Lugar.verificar(id);

      res.json({
        mensaje: 'Lugar verificado exitosamente',
        lugar: lugarVerificado
      });
    } catch (error) {
      console.error('Error verificando lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = LugaresController; 