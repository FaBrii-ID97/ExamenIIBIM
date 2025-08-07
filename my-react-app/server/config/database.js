import { Sequelize } from 'sequelize';

// Configuración de PostgreSQL
const sequelize = new Sequelize('gestionReservas', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgresql',
  port: 5432,
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
  } catch (error) {
    console.error('❌ No se pudo conectar a PostgreSQL:', error);
    throw error;
  }
};

export { sequelize, testConnection };
