import { useState } from 'react'
import Login from './componentes/Login'
import Dashboard from './componentes/Dashboard'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(null)

  const handleLogin = (nombreUsuario) => {
    setUsuario(nombreUsuario)
  }

  const handleLogout = () => {
    setUsuario(null)
  }

  return (
    <div className="App">
      {!usuario ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard usuario={usuario} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
