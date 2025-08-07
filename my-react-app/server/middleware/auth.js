// Middleware simple para verificar roles de admin
// Sin autenticación por tokens - verificación básica por sesión

const verificarAdmin = (req, res, next) => {
  // En una implementación simple, podrías verificar un header o parámetro
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
