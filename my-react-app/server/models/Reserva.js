import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 8
    }
  },
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  }
}, {
  tableName: 'reservas',
  indexes: [
    {
      unique: true,
      fields: ['sectorId', 'fecha', 'hora_inicio'],
      name: 'unique_reserva_sector_fecha_hora'
    }
  ]
});

export default Reserva;
