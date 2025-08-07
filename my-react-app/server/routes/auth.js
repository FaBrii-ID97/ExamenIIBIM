import express from 'express';
import { login, obtenerUsuario } from '../controllers/authController.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta para obtener usuario por ID
router.get('/usuario/:id', obtenerUsuario);

export default router;
