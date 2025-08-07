import express from 'express';
import { Reserva, Sector } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const { fecha, sectorId } = req.query;
    
    let whereClause = {};
    
    if (fecha) {
      whereClause.fecha = fecha;
    }
    
    if (sectorId) {
      whereClause.sectorId = sectorId;
    }

    const reservas = await Reserva.findAll({
      where: whereClause,
      include: [{
        model: Sector,
        as: 'sector',
        attributes: ['id', 'nombre', 'capacidad']
      }],
      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    res.json({
      success: true,
      data: reservas
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservas'
    });
  }
});

// Verificar disponibilidad de horario
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    const { sectorId, fecha, hora_inicio, duracion } = req.body;

    if (!sectorId || !fecha || !hora_inicio || !duracion) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Calcular hora de fin
    const [hora, minutos] = hora_inicio.split(':');
    const horaInicioNum = parseInt(hora);
    const horaFinNum = horaInicioNum + parseInt(duracion);
    const hora_fin = `${horaFinNum.toString().padStart(2, '0')}:${minutos}`;

    // Verificar conflictos
    const conflictos = await Reserva.findAll({
      where: {
        sectorId,
        fecha,
        estado: {
          [Op.not]: 'cancelada'
        },
        [Op.or]: [
          {
            // La nueva reserva empieza durante una reserva existente
            hora_inicio: {
              [Op.between]: [hora_inicio, hora_fin]
            }
          },
          {
            // La nueva reserva termina durante una reserva existente
            hora_fin: {
              [Op.between]: [hora_inicio, hora_fin]
            }
          },
          {
            // La nueva reserva envuelve una reserva existente
            [Op.and]: [
              { hora_inicio: { [Op.gte]: hora_inicio } },
              { hora_fin: { [Op.lte]: hora_fin } }
            ]
          },
          {
            // Una reserva existente envuelve la nueva reserva
            [Op.and]: [
              { hora_inicio: { [Op.lte]: hora_inicio } },
              { hora_fin: { [Op.gte]: hora_fin } }
            ]
          }
        ]
      }
    });

    const disponible = conflictos.length === 0;

    res.json({
      success: true,
      data: {
        disponible,
        conflictos: conflictos.length,
        mensaje: disponible ? 'Horario disponible' : 'Conflicto de horario detectado'
      }
    });

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad'
    });
  }
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  try {
    const { 
      sectorId, 
      fecha, 
      hora_inicio, 
      duracion, 
      nombre_cliente, 
      telefono, 
      email, 
      observaciones 
    } = req.body;

    // Validaciones básicas
    if (!sectorId || !fecha || !hora_inicio || !duracion || !nombre_cliente) {
      return res.status(400).json({
        success: false,
        message: 'Sector, fecha, hora de inicio, duración y nombre del cliente son requeridos'
      });
    }

    // Verificar que el sector existe
    const sector = await Sector.findByPk(sectorId);
    if (!sector || !sector.activo) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado o inactivo'
      });
    }

    // Calcular hora de fin
    const [hora, minutos] = hora_inicio.split(':');
    const horaInicioNum = parseInt(hora);
    const horaFinNum = horaInicioNum + parseInt(duracion);
    const hora_fin = `${horaFinNum.toString().padStart(2, '0')}:${minutos}`;

    // Verificar horarios de funcionamiento (8:00 - 22:00)
    if (horaInicioNum < 8 || horaFinNum > 22) {
      return res.status(400).json({
        success: false,
        message: 'Los horarios de funcionamiento son de 8:00 a 22:00'
      });
    }

    // Verificar que la fecha no sea del pasado
    const fechaReserva = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden hacer reservas para fechas pasadas'
      });
    }

    // Verificar conflictos de horario
    const conflictos = await Reserva.findAll({
      where: {
        sectorId,
        fecha,
        estado: {
          [Op.not]: 'cancelada'
        },
        [Op.or]: [
          {
            [Op.and]: [
              { hora_inicio: { [Op.lt]: hora_fin } },
              { hora_fin: { [Op.gt]: hora_inicio } }
            ]
          }
        ]
      }
    });

    if (conflictos.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una reserva en ese horario para este sector'
      });
    }

    // Calcular precio total
    const precio_total = sector.precio_por_hora * duracion;

    // Crear reserva
    const nuevaReserva = await Reserva.create({
      sectorId,
      fecha,
      hora_inicio,
      hora_fin,
      duracion: parseInt(duracion),
      nombre_cliente,
      telefono,
      email,
      observaciones,
      precio_total,
      usuarioId: null // Sin autenticación compleja
    });

    // Obtener la reserva con el sector incluido
    const reservaCompleta = await Reserva.findByPk(nuevaReserva.id, {
      include: [{
        model: Sector,
        as: 'sector',
        attributes: ['id', 'nombre', 'capacidad']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reservaCompleta
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear reserva'
    });
  }
});

// Obtener reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [{
        model: Sector,
        as: 'sector',
        attributes: ['id', 'nombre', 'capacidad', 'precio_por_hora']
      }]
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      success: true,
      data: reserva
    });

  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reserva'
    });
  }
});

// Cancelar reserva
router.put('/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    if (reserva.estado === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'La reserva ya está cancelada'
      });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reserva
    });

  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar reserva'
    });
  }
});

// Eliminar reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    await reserva.destroy();

    res.json({
      success: true,
      message: 'Reserva eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reserva'
    });
  }
});

export default router;
