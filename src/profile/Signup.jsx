import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

function Signup() {
  const [nombre, setUsername] = useState("");
  const [correo, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`${import.meta.env.VITE_BACKEND_URL}/signup`);
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        nombre: nombre,
        correo: correo,
        contrasena: contrasena
      }).then((response) => {
        console.log('Registro exitoso! Ahora puedes volver y loguearte');
        setError(false);
        console.log('Obtengo: ', response.data.nombre)
        setMsg('Registro exitoso! Ahora puedes volver y loguearte');
      }).catch((error) => {      
      console.error('Ocurrió un error:', error);
      setMsg('Error: '+ error.response.data);
      setError(true); 
      });
    }

  return (
    <>
    <h2>Registrarse</h2>
    <p>Regístrate ahora y sumérgete en la acción. ¡Únete a la diversión en CardHeroes hoy mismo!</p>
    <div className="Login">
        {msg.length > 0 && (
        <div className={error ? "error" : "successMsg"}>
            {msg}
        </div>
        )}

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input 
            type="text" 
            name="nombre"
            value={nombre}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input 
            type="email" 
            name="correo"
            value={correo}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            name="contrasena"
            value={contrasena}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Enviar" />
      </form>
    </div>
    </>
  );
}

export default Signup;