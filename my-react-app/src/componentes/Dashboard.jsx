import React, { useState } from 'react';
import SectorCancha from './sectorcancha';
import Reservas from './ReservasNuevo';
import './Dashboard.css';

function Dashboard({ usuario, onLogout }) {
    const [vistaActual, setVistaActual] = useState('reservas');
    const [sectores, setSectores] = useState([
        { sector: 'Sector A', capacidad: '20' },
        { sector: 'Sector B', capacidad: '15' },
        { sector: 'Cancha Principal', capacidad: '50' }
    ]);

    const handleSectorAgregado = (nuevoSector) => {
        setSectores(prevSectores => [...prevSectores, nuevoSector]);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Sistema de Reservas Deportivas</h1>
                    <div className="user-info">
                        <span>Bienvenido, {usuario}</span>
                        <button onClick={onLogout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
                
                <nav className="dashboard-nav">
                    <button 
                        className={vistaActual === 'reservas' ? 'nav-btn active' : 'nav-btn'}
                        onClick={() => setVistaActual('reservas')}
                    >
                        📅 Reservas
                    </button>
                    <button 
                        className={vistaActual === 'sectores' ? 'nav-btn active' : 'nav-btn'}
                        onClick={() => setVistaActual('sectores')}
                    >
                        🏟️ Gestión de Sectores
                    </button>
                </nav>
            </header>

            <main className="dashboard-main">
                {vistaActual === 'reservas' && (
                    <Reservas sectores={sectores} />
                )}
                
                {vistaActual === 'sectores' && (
                    <div className="sectores-view">
                        <SectorCancha onSectorAgregado={handleSectorAgregado} />
                        
                        <div className="sectores-existentes">
                            <h3>Sectores Disponibles</h3>
                            <div className="grid-sectores">
                                {sectores.map((sector, index) => (
                                    <div key={index} className="tarjeta-sector">
                                        <h4>{sector.sector}</h4>
                                        <p>Capacidad: {sector.capacidad} personas</p>
                                        <div className="sector-status">
                                            <span className="status-disponible">Disponible</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
