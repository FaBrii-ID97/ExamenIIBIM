//controlador para reservar un sector
import Sector from '../models/Sector.js';
    const horaInicio = new Date(fecha);
    horaInicio.setHours(horaInicioNum, parseInt(minutos));
import Reserva from '../models/Reserva.js';
import { Op } from 'sequelize';
    const horaFin = new Date(horaInicio);
    horaFin.setHours(horaFin.getHours() + duracion);

    // Verificar si ya existe una reserva en ese horario
    const reservasExistentes = await Reserva.findAll({
      where: {
        sectorId,
        fecha,
        [Op.or]: [
          {
            hora_inicio: {
              [Op.between]: [horaInicio, horaFin]
            }
          },
          {
            hora_inicio: {
              [Op.lte]: horaInicio
            },
            duracion: {
              [Op.gte]: (horaFin - horaInicio) / 3600000 // Convertir a horas
            }
          }
        ]
      }
    });

    if (reservasExistentes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El sector ya está reservado en ese horario'
      });
    }

    res.json({
      success: true,
      message: 'Horario disponible'
    });

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad'
    });
  }
});
import { sequelize } from '../config/database.js';