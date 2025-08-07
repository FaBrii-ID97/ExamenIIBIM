import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 20]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  rol: {
    type: DataTypes.ENUM('admin'),
    defaultValue: 'admin'
  }
}, {
  tableName: 'usuarios'
});

// Método simple para verificar contraseña (sin hash)
Usuario.prototype.verificarPassword = function(password) {
  return this.password === password;
};

// Método para obtener datos públicos del usuario
Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default Usuario;
