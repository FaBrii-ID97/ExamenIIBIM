import React, { useState } from 'react';
import './Reservas.css';

function Reservas({ sectores = [] }) {
    const [selectedSector, setSelectedSector] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [duracion, setDuracion] = useState('1');
    const [nombreCliente, setNombreCliente] = useState('');
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState('');

    // Horarios disponibles (8:00 AM a 10:00 PM)
    const horariosDisponibles = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
        '20:00', '21:00', '22:00'
    ];

    // Función para verificar conflictos de horario
    const verificarConflicto = (sector, fecha, horaInicio, duracion) => {
        const horaInicioNum = parseInt(horaInicio.split(':')[0]);
        const horaFinNum = horaInicioNum + parseInt(duracion);

        return reservas.some(reserva => {
            if (reserva.sector !== sector || reserva.fecha !== fecha) {
                return false;
            }

            const reservaInicioNum = parseInt(reserva.horaInicio.split(':')[0]);
            const reservaFinNum = reservaInicioNum + parseInt(reserva.duracion);

            // Verificar solapamiento
            return (horaInicioNum < reservaFinNum && horaFinNum > reservaInicioNum);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!selectedSector || !fecha || !horaInicio || !nombreCliente.trim()) {
            setError('Por favor, complete todos los campos');
            return;
        }

        // Verificar que la fecha no sea del pasado
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada < hoy) {
            setError('No se pueden hacer reservas para fechas pasadas');
            return;
        }

        // Verificar conflictos
        if (verificarConflicto(selectedSector, fecha, horaInicio, duracion)) {
            setError('Ya existe una reserva en ese horario para este sector');
            return;
        }

        // Verificar que no exceda el horario de cierre
        const horaInicioNum = parseInt(horaInicio.split(':')[0]);
        const horaFinNum = horaInicioNum + parseInt(duracion);

        if (horaFinNum > 22) {
            setError('La reserva excede el horario de funcionamiento (hasta 22:00)');
            return;
        }

        // Crear nueva reserva
        const nuevaReserva = {
            id: Date.now(),
            sector: selectedSector,
            fecha,
            horaInicio,
            duracion,
            nombreCliente: nombreCliente.trim(),
            horaFin: `${horaInicioNum + parseInt(duracion)}:00`
        };

        setReservas([...reservas, nuevaReserva]);
        
        // Limpiar formulario
        setSelectedSector('');
        setFecha('');
        setHoraInicio('');
        setDuracion('1');
        setNombreCliente('');
    };

    const eliminarReserva = (id) => {
        setReservas(reservas.filter(reserva => reserva.id !== id));
    };

    // Filtrar reservas por fecha para mostrar
    const reservasDelDia = reservas.filter(reserva => reserva.fecha === fecha);

    return (
        <div className="reservas-container">
            <h2>Sistema de Reservas</h2>
            
            <div className="reservas-content">
                <div className="formulario-reserva">
                    <h3>Nueva Reserva</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre del Cliente:</label>
                            <input
                                type="text"
                                value={nombreCliente}
                                onChange={(e) => setNombreCliente(e.target.value)}
                                placeholder="Ingrese nombre completo"
                            />
                        </div>

                        <div className="form-group">
                            <label>Sector:</label>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                            >
                                <option value="">Seleccione un sector</option>
                                {sectores.map((sector, index) => (
                                    <option key={index} value={sector.sector}>
                                        {sector.sector} (Capacidad: {sector.capacidad})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label>Hora de Inicio:</label>
                            <select
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                            >
                                <option value="">Seleccione hora</option>
                                {horariosDisponibles.map(hora => (
                                    <option key={hora} value={hora}>{hora}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duración (horas):</label>
                            <select
                                value={duracion}
                                onChange={(e) => setDuracion(e.target.value)}
                            >
                                <option value="1">1 hora</option>
                                <option value="2">2 horas</option>
                                <option value="3">3 horas</option>
                                <option value="4">4 horas</option>
                            </select>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-reservar">
                            Crear Reserva
                        </button>
                    </form>
                </div>

                <div className="lista-reservas">
                    <h3>Reservas Activas</h3>
                    
                    {fecha && (
                        <div className="reservas-del-dia">
                            <h4>Reservas para {fecha}:</h4>
                            {reservasDelDia.length === 0 ? (
                                <p>No hay reservas para esta fecha</p>
                            ) : (
                                <div className="grid-reservas">
                                    {reservasDelDia.map(reserva => (
                                        <div key={reserva.id} className="tarjeta-reserva">
                                            <h5>{reserva.nombreCliente}</h5>
                                            <p><strong>Sector:</strong> {reserva.sector}</p>
                                            <p><strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
                                            <p><strong>Duración:</strong> {reserva.duracion} hora(s)</p>
                                            <button 
                                                onClick={() => eliminarReserva(reserva.id)}
                                                className="btn-eliminar"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="todas-reservas">
                        <h4>Todas las Reservas ({reservas.length})</h4>
                        {reservas.length === 0 ? (
                            <p>No hay reservas registradas</p>
                        ) : (
                            <div className="lista-completa">
                                {reservas
                                    .sort((a, b) => new Date(a.fecha + ' ' + a.horaInicio) - new Date(b.fecha + ' ' + b.horaInicio))
                                    .map(reserva => (
                                    <div key={reserva.id} className="item-reserva">
                                        <div className="info-reserva">
                                            <strong>{reserva.nombreCliente}</strong> - {reserva.sector}
                                            <br />
                                            <small>{reserva.fecha} | {reserva.horaInicio} - {reserva.horaFin}</small>
                                        </div>
                                        <button 
                                            onClick={() => eliminarReserva(reserva.id)}
                                            className="btn-eliminar-small"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservas;
