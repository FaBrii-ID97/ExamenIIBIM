import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación simple (puedes mejorarlo después)
        if (usuario.trim() === '' || password.trim() === '') {
            setError('Por favor, complete todos los campos');
            return;
        }

        // Simulamos autenticación simple
        if (usuario === 'admin' && password === '123') {
            onLogin(usuario);
            setError('');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sistema de Reservas</h2>
                <h3>Iniciar Sesión</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" className="login-button">
                        Ingresar
                    </button>
                </form>
                
                <div className="login-info">
                    <p><small>Usuario de prueba: admin</small></p>
                    <p><small>Contraseña: 123</small></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
