import { Usuario } from '../models/index.js';
import { Op } from 'sequelize';

// Login simple - sin JWT, solo verificación de credenciales
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ 
      where: { username: username.toLowerCase() } 
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = usuario.verificarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: usuario.toJSON()
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Registro simple
const registro = async (req, res) => {
  try {
    const { nombre, email, username, password, rol = 'cliente' } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({
      where: {
        [Op.or]: [
          { username: username.toLowerCase() },
          { email: email.toLowerCase() }
        ]
      }
    });

    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'Usuario o email ya existe'
      });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      rol
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        usuario: nuevoUsuario.toJSON()
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener información del usuario por ID
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario || !usuario.activo) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        usuario: usuario.toJSON()
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export {
  login,
  registro,
  obtenerUsuario
};
