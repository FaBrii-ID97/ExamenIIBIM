import { Reserva, Sector } from '../models/index.js';
import { Op } from 'sequelize';

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  try {
    const { sectorId, fecha, horaInicio, duracion, nombreCliente } = req.body;

    // Validar campos requeridos
    if (!sectorId || !fecha || !horaInicio || !duracion || !nombreCliente) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que el sector existe
    const sector = await Sector.findByPk(sectorId);
    if (!sector) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado'
      });
    }

    // Verificar que la fecha no sea del pasado
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden hacer reservas para fechas pasadas'
      });
    }

    // Verificar conflictos de horario
    const conflicto = await verificarConflictoHorario(sectorId, fecha, horaInicio, duracion);
    if (conflicto) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una reserva en ese horario para este sector'
      });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      sectorId,
      fecha,
      hora_inicio: horaInicio,
      duracion: parseInt(duracion),
      nombre_cliente: nombreCliente.trim()
    });

    // Obtener la reserva con información del sector
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
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las reservas con filtros opcionales
const obtenerReservas = async (req, res) => {
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
};

// Verificar disponibilidad de horario
const verificarDisponibilidad = async (req, res) => {
  try {
    const { sectorId, fecha, horaInicio, duracion } = req.body;

    // Validar campos requeridos
    if (!sectorId || !fecha || !horaInicio || !duracion) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos para verificar disponibilidad'
      });
    }

    const conflicto = await verificarConflictoHorario(sectorId, fecha, horaInicio, duracion);

    res.json({
      success: true,
      disponible: !conflicto,
      message: conflicto ? 'Horario no disponible' : 'Horario disponible'
    });

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad'
    });
  }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
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
};

// Función auxiliar para verificar conflictos de horario
const verificarConflictoHorario = async (sectorId, fecha, horaInicio, duracion) => {
  try {
    const horaInicioNum = parseInt(horaInicio.split(':')[0]);
    const horaFinNum = horaInicioNum + parseInt(duracion);

    const reservasExistentes = await Reserva.findAll({
      where: {
        sectorId,
        fecha
      }
    });

    return reservasExistentes.some(reserva => {
      const reservaInicioNum = parseInt(reserva.hora_inicio.split(':')[0]);
      const reservaFinNum = reservaInicioNum + reserva.duracion;

      // Verificar solapamiento
      return (horaInicioNum < reservaFinNum && horaFinNum > reservaInicioNum);
    });

  } catch (error) {
    console.error('Error al verificar conflicto:', error);
    return true; // En caso de error, consideramos que hay conflicto
  }
};

export {
  crearReserva,
  obtenerReservas,
  verificarDisponibilidad,
  eliminarReserva
};