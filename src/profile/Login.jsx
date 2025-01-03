import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css';

function Login() {
  const { token, setToken, nombre, setNombre } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Valor actual de nombre:", nombre);
    console.log(`Haciendo el request a ${import.meta.env.VITE_BACKEND_URL}/login`);
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        correo: correo,
        contrasena: contrasena
      }).then((response) => {
        console.log('Login successful');
        setError(false);
        setMsg("Login exitoso!");
        // Recibimos el token y lo procesamos
        const access_token = response.data.access_token;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        console.log("Se seteo el token: ", token);
        // Realizar la segunda consulta para obtener jugadores
        console.log(`${import.meta.env.VITE_BACKEND_URL}/usuarios/correo/${correo}`)
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/usuarios/correo/${correo}`)
        .then(response => {
          const nombre = response.data.nombre;
          localStorage.setItem('nombre', nombre);
          setNombre(nombre)
          console.log("Se seteo el nombre: ", nombre);
        })
        .catch(error => {
          console.error('Error fetching usuarios:', error);
        });
      }).catch((error) => {
        console.error('An error occurred while trying to login:', error);
        setError(true);
      })
  };

  return (
    <>
    <h2>Iniciar Sesión</h2>
    <p>¿Listo para sumergirte una vez más en CardHeroes y demostrar tu habilidad estratégica ? ¡Es hora de retomar la aventura y reclamar tu lugar en la cima!</p>
    <div className="Login">
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}

      {error && <div className="error">Hubo un error con el Login, por favor trata nuevamente.</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            name="correo"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            name="contrasena"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Enviar" />
      </form>
    </div>
    </>
  );
}

export default Login;