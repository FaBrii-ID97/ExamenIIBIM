
const verificarAdmin = (req, res, next) => {
  const isAdmin = req.headers['admin-user'] === 'true' || req.query.admin === 'true';
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

// Middleware básico que no hace verificación real
const verificarAuth = (req, res, next) => {
  // En autenticación simple, simplemente pasamos al siguiente middleware
  next();
};

export {
  verificarAuth,
  verificarAdmin
};
