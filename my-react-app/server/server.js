import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import { sincronizarDB } from './models/index.js';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Ruta de prueba simple
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    mode: 'Frontend local - Backend simple'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada - El frontend maneja toda la lógica localmente'
  });
});

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    await sincronizarDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor simple corriendo en puerto ${PORT}`);
      console.log(`� Frontend maneja toda la lógica localmente`);
      console.log(`✅ CORS configurado para: http://localhost:5173`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
};

iniciarServidor();