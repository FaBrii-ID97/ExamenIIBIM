import express from 'express';
import { Sector } from '../models/index.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los sectores activos
router.get('/', async (req, res) => {
  try {
    const sectores = await Sector.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: sectores
    });

  } catch (error) {
    console.error('Error al obtener sectores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sectores'
    });
  }
});

// Obtener un sector por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sector = await Sector.findByPk(id);
    
    if (!sector) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado'
      });
    }

    res.json({
      success: true,
      data: sector
    });

  } catch (error) {
    console.error('Error al obtener sector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sector'
    });
  }
});

// Crear nuevo sector
router.post('/', verificarAdmin, async (req, res) => {
  try {
    const { nombre, capacidad, descripcion, precio_por_hora } = req.body;

    // Validaciones
    if (!nombre || !capacidad) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y capacidad son requeridos'
      });
    }

    // Verificar si el sector ya existe
    const sectorExiste = await Sector.findOne({ where: { nombre } });
    if (sectorExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un sector con ese nombre'
      });
    }

    const nuevoSector = await Sector.create({
      nombre,
      capacidad: parseInt(capacidad),
      descripcion,
      precio_por_hora: precio_por_hora || 0
    });

    res.status(201).json({
      success: true,
      message: 'Sector creado exitosamente',
      data: nuevoSector
    });

  } catch (error) {
    console.error('Error al crear sector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear sector'
    });
  }
});

// Actualizar sector
router.put('/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, capacidad, descripcion, precio_por_hora, activo } = req.body;

    const sector = await Sector.findByPk(id);
    
    if (!sector) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado'
      });
    }

    // Verificar si el nuevo nombre ya existe (si se está cambiando)
    if (nombre && nombre !== sector.nombre) {
      const sectorConNombre = await Sector.findOne({ 
        where: { nombre },
        exclude: { id }
      });
      
      if (sectorConNombre) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un sector con ese nombre'
        });
      }
    }

    // Actualizar campos
    if (nombre) sector.nombre = nombre;
    if (capacidad) sector.capacidad = parseInt(capacidad);
    if (descripcion !== undefined) sector.descripcion = descripcion;
    if (precio_por_hora !== undefined) sector.precio_por_hora = precio_por_hora;
    if (activo !== undefined) sector.activo = activo;

    await sector.save();

    res.json({
      success: true,
      message: 'Sector actualizado exitosamente',
      data: sector
    });

  } catch (error) {
    console.error('Error al actualizar sector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar sector'
    });
  }
});

// Eliminar sector - eliminación lógica
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const sector = await Sector.findByPk(id);
    
    if (!sector) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado'
      });
    }

    // Eliminación lógica
    sector.activo = false;
    await sector.save();

    res.json({
      success: true,
      message: 'Sector eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar sector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar sector'
    });
  }
});

export default router;
