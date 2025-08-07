import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection, sincronizarDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import sectoresRoutes from './routes/sectores.js';
import reservasRoutes from './routes/reservas.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de prueba
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente con PostgreSQL',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL',
    auth: 'Simple (sin JWT)'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/sectores', sectoresRoutes);
app.use('/api/reservas', reservasRoutes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar base de datos
    await sincronizarDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🐘 Base de datos: gestionReservas`);
      console.log(`✅ CORS configurado para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();