// Importación de Sequelize para ORM (Object-Relational Mapping)
import { Sequelize } from 'sequelize';
// Importación de dotenv para cargar variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la base de datos PostgreSQL usando variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestionReservas', // Nombre de la base de datos
  process.env.DB_USER || 'postgres', // Usuario de la base de datos
  process.env.DB_PASSWORD || 'postgres', // Contraseña de la base de datos
  {
    host: process.env.DB_HOST || 'localhost', // Host de la base de datos
    port: process.env.DB_PORT || 5432, // Puerto de PostgreSQL
    dialect: process.env.DB_DIALECT || 'postgres', // Tipo de base de datos
    logging: false, // Desactivar logs de SQL para producción
    pool: {
      max: 5, // Máximo número de conexiones en el pool
      min: 0, // Mínimo número de conexiones en el pool
      acquire: 30000, // Tiempo máximo para adquirir una conexión (30 segundos)
      idle: 10000 // Tiempo máximo que una conexión puede estar inactiva (10 segundos)
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a PostgreSQL:', error);
  }
};

// Función para sincronizar la base de datos
const sincronizarDB = async () => {
  try {
    // Importar modelos aquí para evitar dependencias circulares
    const { default: Usuario } = await import('../models/Usuario.js');
    const { default: Sector } = await import('../models/Sector.js');
    const { default: Reserva } = await import('../models/Reserva.js');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false }); // force: false para no eliminar datos existentes
    console.log('✅ Base de datos sincronizada correctamente.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

// Exportar la instancia configurada de Sequelize y funciones
export { sequelize, testConnection, sincronizarDB }; 