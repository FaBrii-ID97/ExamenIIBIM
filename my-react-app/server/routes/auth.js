import express from 'express';
import { login, registro, obtenerUsuario } from '../controllers/authController.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta de registro
router.post('/registro', registro);

// Ruta para obtener usuario por ID
router.get('/usuario/:id', obtenerUsuario);

export default router;
