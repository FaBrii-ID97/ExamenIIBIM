# Sistema de Reservas Deportivas

## Descripción
Sistema simple de reservas deportivas con frontend en React que maneja toda la lógica localmente.

## Características
- ✅ Login simple (usuario: admin, contraseña: 123)
- ✅ Gestión de sectores deportivos
- ✅ Sistema de reservas por horarios
- ✅ Validación de conflictos de horarios
- ✅ Interfaz responsive y moderna

## Arquitectura
- **Frontend**: React con Vite - Maneja toda la lógica localmente
- **Backend**: Express simple - Solo para CORS y testing

## Instalación y Uso

### Frontend
```bash
cd my-react-app
npm install
npm run dev
```

### Backend (Opcional)
```bash
cd server
npm install
npm run dev
```

## Datos de Prueba
- **Usuario**: admin
- **Contraseña**: 123
- **Sectores predeterminados**: 
  - Sector A (Capacidad: 20)
  - Sector B (Capacidad: 15) 
  - Cancha Principal (Capacidad: 50)

## Funcionalidades

### Login
- Autenticación simple hardcodeada
- Usuario único: admin/123

### Dashboard
- Vista de reservas activas
- Gestión de sectores deportivos
- Navegación entre secciones

### Reservas
- Crear nuevas reservas con validaciones
- Ver reservas por fecha
- Eliminar reservas existentes
- Validación de conflictos de horarios
- Horario de funcionamiento: 8:00 - 22:00

### Gestión de Sectores
- Agregar nuevos sectores
- Ver sectores disponibles
- Capacidad por sector

## Estructura del Proyecto
```
my-react-app/
├── src/
│   ├── componentes/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ReservasNuevo.jsx
│   │   └── sectorcancha.jsx
│   ├── App.jsx
│   └── main.jsx
└── server/
    ├── models/
    │   └── index.js
    ├── server.js
    └── package.json
```

## Notas Técnicas
- Todo el estado se maneja en el frontend con React hooks
- No hay persistencia de datos (se reinicia al recargar)
- El backend es opcional y solo proporciona CORS
- Diseño responsive con CSS moderno+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
