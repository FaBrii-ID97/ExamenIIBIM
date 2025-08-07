import { sequelize } from '../config/database.js';

// Función para sincronizar la base de datos
const sincronizarDB = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de datos PostgreSQL sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

export {
  sequelize,
  sincronizarDB
};
