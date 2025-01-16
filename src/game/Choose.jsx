import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import './Choose.css';
import LogoutButton from '../profile/Logout'

const Choose = () => {
  const { token, nombre } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [arcanos, setArcanos] = useState([]);
  const [selectedArcano, setSelectedArcano] = useState(null);
  const [arcanosNoDisponibles, setArcanosNoDisponibles] = useState([]);
  const [hoveredMessage, setHoveredMessage] = useState(false);
  const [hoveredArcano, setHoveredArcano] = useState(null);

  useEffect(() => {
    console.log("Fetching user data");
    axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACKEND_URL}/scope-example/protecteduser`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
      console.log("User data fetched:", response.data.user);
      setStatus(response.data.message);
      setIsLoggedIn(true); 
      
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/personajes`)
      .then(response => {
        console.log("Arcanos fetched:", response.data);
        setArcanos(response.data);
      })
      .catch(error => {
        console.error('Error fetching arcanos:', error);
      });
    })
    .catch(error => {
      setStatus(error.message);
      setIsLoggedIn(false);
    });
  }, [token]);

  // Revisa los arcanos no disponibles
  useEffect(() => {
    if (arcanos) {
      const interval = setInterval(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/personajes/nodisponibles/${nombre}`)
        .then(response => {
          console.log("Arcanos no disponibles:", response.data);
          setArcanosNoDisponibles(response.data)
        })
        .catch(error => {
          console.error('Error encontrando arcanos no disponibles:', error);
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  });

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const handleArcanoClick = (arcano) => {
    console.log("Arcano clicked:", arcano);
    // Verificar si el arcano está disponible
    if (arcanosNoDisponibles.some(ad => ad.id === arcano.id)) {
      console.log("Arcano no disponible");
      // Mostrar mensaje "arcano no disponible"
      alert("Arcano no disponible, uno de los jugadores ya lo selecciono. Elige otro por favor.");
      return;
    }
    setSelectedArcano(arcano);
  };

  const handleAssignCartas = () => {
    // Aigna cartas a los jugadores y id del arcano al jugador actual
    return axios.post(`${import.meta.env.VITE_BACKEND_URL}/cartas/${nombre}/${selectedArcano.id}`)
    .then(response => {
      console.log("Cartas asignadas:", response.data);
    })
    .catch(error => {
      console.error('Error asignando cartas:', error);
      throw error;
    });
  };

  const handleDeleteEspera = () => {
    // Elimina la sala de espera
    return axios.delete(`${import.meta.env.VITE_BACKEND_URL}/esperas/${nombre}`)
    .then(response => {
      console.log("Sala de espera eliminada:", response.data);
    })
    .catch(error => {
      console.error('Error eliminando sala de espera:', error);
    });
  };
  
  const handleConfirm = () => {
    if (selectedArcano) {
      console.log('Arcano seleccionado:', selectedArcano);
      // Asignamos cartas/arcano y eliminamos la sala de espera
      handleAssignCartas()
      .then(() => {
        handleDeleteEspera()
        .then(() => {
          console.log("Funciono todo");
          goBoard();
        })
      })

    .catch(error => {
      console.error('Error en el proceso de confirmación:', error);
    });
    }
  };

  const goBoard = () => {
    window.location.href = '/fight';
  };
  
  const handleMouseEnter = (arcano) => {
    setHoveredMessage(
      `${arcano.nombre}, ${arcano.alias}. Su elemento es ${arcano.elemento}. ${arcano.descripcion_habilidad}`
    );
    setHoveredArcano(arcano); // Guarda el arcano actual
  };
  const handleMouseLeave = () => {
    setHoveredMessage(false);
    setHoveredArcano(false); 
  };  

  const arcanoPairs = chunkArray(arcanos, 2);
  // Revisa si el arcano esta dentro de los no disponibles
  const isArcanoNoDisponible = (arcano) => {
    return arcanosNoDisponibles.some(a => a.id === arcano.id);
  };

  return (
    <>
      <div>
          <div>
            {isLoggedIn && (
              <div>
                <div className="container">
                  <h1>Elige tu Personaje</h1>
                  <div className="user-info">
                    <a>Mi usuario: {nombre}</a>
                    <div className="logout">
                      {nombre && <LogoutButton />}
                    </div>
                  </div>
                </div>

                <table className="arcanos-table">
                  <tbody>
                    {arcanoPairs.map((pair, index) => (
                      <tr key={index}>
                        {pair.map((arcano, arcanoIndex) => (
                          <td 
                            className={`fila-arcano ${selectedArcano && selectedArcano.id === arcano.id ? 'selected' : ''}`} 
                            key={arcanoIndex} 
                            onClick={() => handleArcanoClick(arcano)}
                            onMouseEnter={() => handleMouseEnter(arcano)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className={`arcano-wrapper ${isArcanoNoDisponible(arcano) ? 'no-disponible' : ''}`}>
                            <table>
                              <tbody className="fila">
                                <tr>
                                  <td>
                                    <img 
                                      src={`./assets/imgs/${arcano.nombre}.png`}
                                      className={`foto-${arcano.nombre} ${selectedArcano && selectedArcano.id === arcano.id ? 'selected' : ''}`}
                                      alt={arcano.nombre}
                                    />
                                    {isArcanoNoDisponible(arcano) && <div className="overlay"></div>}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="nombre-arcano">{arcano.nombre}</td>
                                </tr>
                              </tbody>
                            </table>
                            {hoveredArcano?.id === arcano.id && (
                              <div
                                className={`mensaje-hover ${
                                  arcano.id === 1 || arcano.id === 3 ? 'left' : 'right'
                                }`}
                              >
                                <p>{hoveredMessage}</p>
                              </div>
                            )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="ch-button">
                  <button className="button-confirmar" onClick={handleConfirm}> Confirmar</button>
                </div>
              </div>
            )}
          </div>
          <br/>
          <br/>
          <div>
              {!isLoggedIn && <h2>Necesitas logearte para jugar!</h2>}
          </div>
      </div>
    </>
  );
}

export default Choose;