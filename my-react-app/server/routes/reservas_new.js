import express from 'express';
import {
  crearReserva,
  obtenerReservas,
  verificarDisponibilidad,
  eliminarReserva
} from '../controllers/reservacontroller.js';

const router = express.Router();

// Obtener todas las reservas (con filtros opcionales)
router.get('/', obtenerReservas);

// Crear una nueva reserva
router.post('/', crearReserva);

// Verificar disponibilidad de horario
router.post('/verificar-disponibilidad', verificarDisponibilidad);

// Eliminar una reserva
router.delete('/:id', eliminarReserva);

export default router;
