// aqui sirve para crear un componente de React que maneja reservas
import React, { useState } from 'react';
import './reservas.css';
function Reservas() {
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [reservas, setReservas] = useState([]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre && fecha && hora) {
        setReservas([...reservas, { nombre, fecha, hora }]);
        setNombre('');
        setFecha('');
        setHora('');
        }
        
    };
    
    return (
        <div className="reservas-container">
        <h2>Reservas</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            />
            <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            />
            <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            />
            <button type="submit">Reservar</button>
        </form>
        <ul>
            {reservas.map((reserva, index) => (
            <li key={index}>
                {reserva.nombre} - {reserva.fecha} - {reserva.hora}
            </li>
            ))}
        </ul>
        </div>
    );
}
export default Reservas;