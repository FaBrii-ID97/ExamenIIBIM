//componente para manejar sectores de cancha
import React, { useState } from 'react';
import './sectorcancha.css';

function SectorCancha({ onSectorAgregado }) {
    const [sector, setSector] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!sector.trim() || !capacidad.trim()) {
            setError('Por favor, complete todos los campos');
            return;
        }

        if (parseInt(capacidad) <= 0) {
            setError('La capacidad debe ser un número mayor a 0');
            return;
        }

        const nuevoSector = { 
            sector: sector.trim(), 
            capacidad: capacidad.trim() 
        };
        
        if (onSectorAgregado) {
            onSectorAgregado(nuevoSector);
        }
        
        setSector('');
        setCapacidad('');
    };

    return (
        <div className="sector-container">
            <h3>Agregar Nuevo Sector</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del Sector:</label>
                    <input
                        type="text"
                        placeholder="Ej: Sector A, Cancha Principal"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label>Capacidad (personas):</label>
                    <input
                        type="number"
                        placeholder="Ej: 20"
                        value={capacidad}
                        onChange={(e) => setCapacidad(e.target.value)}
                        min="1"
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="btn-agregar">
                    Agregar Sector
                </button>
            </form>
        </div>
    );
}

export default SectorCancha;
