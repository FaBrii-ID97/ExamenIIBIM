import { sequelize } from '../config/database.js';
import Usuario from './Usuario.js';
import Sector from './Sector.js';
import Reserva from './Reserva.js';

// Definir relaciones
// Un sector puede tener muchas reservas
Sector.hasMany(Reserva, {
  foreignKey: 'sectorId',
  as: 'reservas'
});

// Una reserva pertenece a un sector
Reserva.belongsTo(Sector, {
  foreignKey: 'sectorId',
  as: 'sector'
});

// Un usuario puede tener muchas reservas
Usuario.hasMany(Reserva, {
  foreignKey: 'usuarioId',
  as: 'reservas'
});

// Una reserva puede pertenecer a un usuario (opcional)
Reserva.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
  allowNull: true
});

// Función para sincronizar la base de datos
const sincronizarDB = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de datos PostgreSQL sincronizada correctamente');
    
    // Crear datos iniciales si la base de datos está vacía
    if (force) {
      await crearDatosIniciales();
    }
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }
};

// Función para crear datos iniciales
const crearDatosIniciales = async () => {
  try {
    // Crear usuario administrador por defecto
    const adminExiste = await Usuario.findOne({ where: { username: 'admin' } });
    if (!adminExiste) {
      await Usuario.create({
        username: 'admin',
        password: '123',
        rol: 'admin'
      });
      console.log('✅ Usuario administrador creado');
    }

    // Crear sectores por defecto
    const sectoresDefecto = [
      { nombre: 'Sector A', capacidad: 20, descripcion: 'Sector ideal para deportes pequeños', precio_por_hora: 25.00 },
      { nombre: 'Sector B', capacidad: 15, descripcion: 'Sector mediano para grupos reducidos', precio_por_hora: 20.00 },
      { nombre: 'Cancha Principal', capacidad: 50, descripcion: 'Cancha principal para eventos grandes', precio_por_hora: 50.00 }
    ];

    for (const sectorData of sectoresDefecto) {
      const sectorExiste = await Sector.findOne({ where: { nombre: sectorData.nombre } });
      if (!sectorExiste) {
        await Sector.create(sectorData);
      }
    }
    console.log('✅ Sectores por defecto creados');

  } catch (error) {
    console.error('❌ Error al crear datos iniciales:', error);
  }
};

// Si este archivo se ejecuta directamente, sincronizar la DB
if (process.argv[1] === new URL(import.meta.url).pathname) {
  sincronizarDB(true).then(() => {
    process.exit(0);
  });
}

export {
  sequelize,
  Usuario,
  Sector,
  Reserva,
  sincronizarDB,
  crearDatosIniciales
};
