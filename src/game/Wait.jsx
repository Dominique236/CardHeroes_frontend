import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { WaitContext } from '../wait/WaitContext';
import './Wait.css'
import LogoutButton from '../profile/Logout'

export default function Wait() { 
  const { token, nombre } = useContext(AuthContext)
  const [status, setStatus] = useState(null);
  const [codigoCreado, setCodigoCreado] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [espera, setEspera] = useState(null);
  const [partida, setPartida] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const { selectedOption, selectedTablero, codigo, setCodigo, turnos, setTurnos } = useContext(WaitContext);

  console.log("Valor actual de selectedOption:", selectedOption);
  console.log("Valor actual de selectedTablero:", selectedTablero);
  useEffect(() => {
    console.log(token);
    console.log(`${import.meta.env.VITE_BACKEND_URL}/scope-example/protecteduser`)
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_BACKEND_URL}/scope-example/protecteduser`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.user)
        setStatus(response.data.message)
        setIsLoggedIn(true); // Si el usuario está logeado
        if (selectedOption != ""){
          console.log('if 1')
          // Crear nueva espera
          axios.post(`${import.meta.env.VITE_BACKEND_URL}/esperas/${nombre}`)
          .then(response => {
            console.log("codigo creado y espera id:", response.data);
            setCodigoCreado(response.data.codigo);
            setEspera(response.data.id);
          })
          .catch(error => {
            console.error('Error creando espera:', error);
          });
        } else if (selectedOption == "") {
          console.log('else if 1')
          if (codigo != ""){
              console.log('if 2')
              // Buscar espera según codigo
              axios.get(`${import.meta.env.VITE_BACKEND_URL}/esperas/${codigo}/${nombre}`)
              .then(response => {
                console.log("codigo encontrado y espera id:", response.data)
                setCodigo(response.data.codigo);
                setEspera(response.data.id);
              })
              .catch(error => {
                console.error('Error creando espera:', error);
              });
          } else if (codigo == "") {
            console.log('else if 2')
            // Buscar espera random
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/esperas/${nombre}`)
            .then(response => {
              console.log("codigo encontrado random y espera id:", response.data)
              setCodigo(response.data.codigo);
              setEspera(response.data.id);
            })
            .catch(error => {
              console.error('Error buscando espera:', error);
            });
          }
        };
      })
      .catch(error => {
        setStatus(error.message);
        setIsLoggedIn(false); // Si el usuario no está logeado
      });
  }, [token]);

  useEffect(() => {
    if (nombre) {
      const intervalId = setInterval(() => {
        // Verifica cada 2 segundos si la partida fue creada por otro usuario
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/partidas/status/${nombre}`)
          .then(response => {
            console.log(response.data)
            if (response.data.encontrado) {
              clearInterval(intervalId);
              setTurnos(response.data.turnos);
              console.log("Partida encontrada. Turnos", response.data.turnos);
              window.location.href = `/choose`;
            }
          })
          .catch(error => {
            console.error('Error verificando el estado de la partida:', error);
          });
        // Verifica cada 2 segundos los usuarios en la sala de espera para actualizar el frontend
        if (codigoCreado) {
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/esperas/find/users/${codigoCreado}`)
          .then(response => {
            console.log('Usuarios en la espera:', response.data)
            setUsuarios(response.data);
          })
          .catch(error => {
            console.error('Error verificando los usuarios actuales en la espera:', error);
          });
        } else {
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/esperas/find/users/${codigo}`)
          .then(response => {
            console.log('Usuarios en la espera:', response.data)
            setUsuarios(response.data);
          })
          .catch(error => {
            console.error('Error verificando los usuarios actuales en la espera:', error);
          });
        };
        console.log('Variable turnos: ',turnos)
      }, 2000); // Verifica cada 2 segundos

      return () => clearInterval(intervalId);
    }
  }, [espera]);

  const handleCreatePartida = () => {
    // Crea la partida (crea partida y los jugadores que estaban en espera)
    return axios.post(`${import.meta.env.VITE_BACKEND_URL}/partidas/${espera}/${selectedTablero}`)
    .then(response => {
      console.log("Partida creada:", response.data);
      console.log("id", response.data.partida.id);
      console.log("Partida creada. Turnos", response.data.turnos);
      setPartida(response.data.partida.id);
      setTurnos(response.data.turnos);
      window.location.href = `/choose`;
    })
    .catch(error => {
      console.error('Error creando partida:', error);
      throw error;
    });
};

  console.log(isLoggedIn)
  console.log(`selected option:${selectedOption}`)
  console.log(`codigo:${codigo}`)
  console.log('Codigo creado:', codigoCreado)

  // Calcula los espacios vacíos necesarios
  const filledSlots = usuarios.length;
  const emptySlots = 2 - filledSlots;

  return (
    <div>
      <div>
      {!isLoggedIn && <h2>¡Necesitas logearte para jugar!</h2>}
      </div>

      <div>
          {isLoggedIn && 
          <div className="user-info">
            <a>Mi usuario: {nombre}</a>
            <div className="logout">
                {nombre && <LogoutButton />}
            </div>
          </div>}
      </div>

      <div>
          {isLoggedIn && 
          <h1>Sala de Espera</h1>}
      </div>

      <div>
          {isLoggedIn && codigoCreado &&
          <a className='codigo'>Código de Sala: {codigoCreado}</a>}
          {isLoggedIn && codigo &&
          <a className='codigo'>Código de Sala: {codigo}</a>}
      </div>

      <div>
      {isLoggedIn && 
        <table className="table-players">
          <tbody>
            <tr>
            {usuarios.map((usuario, index) => (
              <td key={index}>
                {/* <div className="circle"></div>
                <img src={`./assets/imgs/Default.png`} ></img> */}
                <div className="circle-container">
                  <div className="circle"></div>
                  <img src={`./assets/imgs/Default.png`} className="circle-image"></img>
                </div>
                <div className="player-name">{usuario}</div>
              </td>
              ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <td key={`empty-${index}`}>
                <div className="circle-vacio"></div>
                <div className="player-name">????</div>
              </td>
            ))}
            </tr>
          </tbody>
        </table>}
      </div>

      <br></br>

      <div className="ch-button">
          {isLoggedIn && 
          <div>
            <button className='button button-spacing' onClick={handleCreatePartida}>
              Comenzar partida
            </button>
            <a href='/usercheck'>
              <button >Abandonar partida</button>
            </a>
          </div>
          }
      </div>
      <br></br>
    </div>
  );
}