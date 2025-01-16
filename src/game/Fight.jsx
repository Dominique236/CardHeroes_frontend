import React, { useEffect, useState, useContext } from 'react';
import { FightContext } from '../fight/FightContext';
import axios from 'axios';
import Mazo from './Mazo';
import Carta from './Carta';
import PlayerInfo from './PlayerInfo';
import ProgressTracker from './ProgressTracker';
import PopupHabilidad from './PopupHabilidad';
import { AuthContext } from '../auth/AuthContext';
import './Fight.css';

export default function Fight() {
    const { oponente, setOponente } = useContext(FightContext);
    const { nombre } = useContext(AuthContext)
    const [ronda, setRonda] = useState(1); //Ronda actual
    const [jugadaJ, setJugadaJ] = useState([]); //Cartas jugada jugador
    const [jugadaO, setJugadaO] = useState([]); //Cartas jugada oponente

    const [selectedJ, setSelectedJ] = useState(null); //Carta seleccionada jugador
    const [selectedO, setSelectedO] = useState(null); //Carta seleccionada oponente

    const [puntajeJ, setPuntajeJ] = useState(0); //Puntaje jugador
    const [puntajeO, setPuntajeO] = useState(0); //Puntaje oponente

    const [cartas_j, setCartasJ] = useState([]); //Cartas mazo jugador

    const [jugador_info, setJugador_info] = useState([]); //info del jugador actual
    const [players_info, setPlayers_info] = useState([]); //info de los otros jugadores

    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Estado para bloquear el botón confirmar
    const [showPopup, setShowPopup] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [habilidad, setHabilidad] = useState(false); // Estado para bloquear botón habilidad (habilidad disponible)
    const [showPopupHabilidad, setShowPopupHabilidad] = useState(false); // Estado para mostrar popup habilidad
    const [personaje, setPersonaje] = useState([]); // Estado para guardar la información del personaje actual

    const [ganador, setGanador] = useState(null); // Estado para guardar al ganador
    const [showEnding, setShowEnding] = useState(false); // Estado para controlar la visibilidad del pop-up Ending

    // Obtener el ID del oponente primero
    useEffect(() => {
        if (nombre) {
            console.log('Ejecutando useEffect para obtener oponente con nombre:', nombre);
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/partidas/oponente/${nombre}`)
                .then((response) => {
                    console.log('Oponente:', response.data[0]);
                    setOponente(response.data[0].id);
                })
                .catch((error) => {
                    console.error('Error al obtener el oponente:', error);
                });
        } else {
            console.warn('Nombre no definido, no se ejecuta useEffect');
        }
    }, [nombre]);

    // Obtener las cartas del jugador
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/cartas/find/${nombre}`)
        .then((response) => {
            setCartasJ(response.data.cartas);
        })
        .catch((error) => {
            console.error('Error al obtener las cartas del jugador:', error);
        });
    }, [nombre, ronda, showPopupHabilidad, showPopup]);

    // Revisar si jugador fue atacado por oponente cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/atacados/${nombre}`)
            .then((response) => {
                if (response.data.atacado) {
                    setMensaje("¡Fuiste atacado por la habilidad de tu oponente!");
                    setShowPopup(true);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 3000); // Oculta el popup después de 3 segundos
                }
            })
            .catch((error) => {
                console.error("Error al revisar si fuiste atacado:", error);
            });
        }, 3000); // Ejecutar cada 3 segundos
        return () => clearInterval(interval);
    }, []);

    // Obtener información de los jugadores (jugador y oponente)
    useEffect(() => {
        if (oponente) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadores/find/${nombre}/${oponente}`)
            .then((response) => {
                console.log("players_info: ", response.data.oponente);
                setPlayers_info(response.data.oponente);
                setJugador_info(response.data.jugador);
                if (response.data.jugador.estrellas > 0) {
                    setHabilidad(true);
                } else {
                    setHabilidad(false);
                }
            })
            .catch((error) => {
                console.error('Error al obtener la información de los jugadores:', error);
            });
        }
    }, [oponente, ronda, showPopupHabilidad]);

    // Obtener jugadas (jugador y oponente) 
    useEffect(() => {
        if (oponente) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadas/find/${nombre}`)
            .then((response) => {
                console.log("jugada jugador actual: ", response.data);
                setJugadaJ(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener la información de la jugada:', error);
            });
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadas/${oponente}`)
            .then((response) => {
                console.log("jugada oponente: ", response.data);
                setJugadaO(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener información de la jugada del oponente:', error);
            });
        }
    }, [ronda, showPopupHabilidad]);

    // Revisar quien gana y reiniciar jugada
    useEffect(() => {
        if (selectedO) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/cartas/win/${selectedJ.cartaId}/${selectedO.id}`)
            .then((response) => {
                console.log("respuesta al revisar quien ganó: ", response.data);
                if (response.data.resultado) {
                    setMensaje("¡Tu carta gana!");
                    setPuntajeJ((prevPuntajeJ) => prevPuntajeJ + 1);
                } else {
                    setMensaje("¡Tu carta pierde!");
                    setPuntajeO((prevPuntajeO) => prevPuntajeO + 1);
                }
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    setRonda((prevRonda) => prevRonda + 1);
                    setSelectedJ(null);
                    setSelectedO(null);
                    setIsButtonDisabled(false);
                }, 3000); // Oculta el popup después de 3 segundos
            })
            .catch((error) => {
                console.error('Error al revisar quien ganó:', error);
            });
        }
    }, [selectedO]);    
    
    const handleCartaClick = (carta) => {
        console.log("Carta clicked:", carta);
        setSelectedJ(carta);
    };

    const handleConfirm = () => {
        console.log("Confirmando carta: ", selectedJ);
        //Usar endpoint para guardar mi carta en la Jugada y bloquear botón 
        // popup que tape el mazo para que no pueda elegir otra carta
        if (selectedJ) {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/jugadas/${nombre}/${ronda}/${selectedJ.cartaId}`)
            .then((response) => {
                setMensaje("¡Carta seleccionada!");
                console.log("Jugada actualizada: ", response.data);
                setIsButtonDisabled(true); // Bloquea el botón
                setShowPopup(true); // Muestra el popup
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000); // Oculta el popup después de 3 segundos
                // Consultar cada 3 segundos si oponente hizo su jugada
                const checkJugadaOponente = () => {
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadas/check/${oponente}/${ronda}`)
                    .then((response) => {
                        console.log("respuesta al revisar si jugó oponente: ", response.data);
                        if (response.data.jugadaHecha) {
                            setSelectedO(response.data.carta);
                            // Detener la consulta después de que el oponente haya jugado
                            clearInterval(intervalId);
                        }
                    })
                    .catch((error) => {
                        console.error('Error al revisar si jugó oponente:', error);
                    });
                };
                // Iniciar la consulta repetida cada 3 segundos
                const intervalId = setInterval(checkJugadaOponente, 3000);
            })
            .catch((error) => {
                console.error('Error al actualizar la jugada:', error);
            });
        }
    };

    const handleHabilidad = () => {
        // Hacer cambios en back
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/personajes/${nombre}`)
        .then((response) => {
            console.log("Personaje consultado correctamente: ", response.data);
            setPersonaje(response.data)
            setShowPopupHabilidad(true); // mostrar pop-up para elegir en quien aplicar la habilidad
        })
        .catch((error) => {
            console.error('Error al consultar personaje:', error);
        });
    };
    const handleCloseModal = () => {
        setShowPopupHabilidad(false);
    };
    
    // Revisar si terminan 3 rondas de jugada
    useEffect(() => {
        console.log("valor de ronda:", ronda)
        const finalizarJugada = async () => {
            try {
                const endpoint = puntajeJ > puntajeO
                    ? `${import.meta.env.VITE_BACKEND_URL}/jugadas/fin/${nombre}/true`
                    : `${import.meta.env.VITE_BACKEND_URL}/jugadas/fin/${nombre}/false`;
    
                const response = await axios.patch(endpoint);
                console.log("Jugada reiniciada correctamente:", response.data);
                // Reiniciar ronda solo si el backend confirma
                setRonda(1);
                setPuntajeJ(0);
                setPuntajeO(0);
                setJugadaO([]);
            } catch (error) {
                console.error("Error al reiniciar la jugada:", error);
            }
        };
        const revisarGanador = async () => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/partidas/ganador/${nombre}/${oponente}`)
            .then((response) => {
                console.log("respuesta al revisar quien gano: ", response.data);
                if (response.data.ganador) {
                    setGanador(response.data.ganador);
                }
            })
            .catch((error) => {
                console.error('Error al revisar quien gano:', error);
            });
        };
        const manejarRonda = async () => {
            try {
                await finalizarJugada(); // Espera a que se complete la finalización de la jugada
                await revisarGanador(); // Luego revisa si hay un ganador
            } catch (error) {
                console.error("Error al manejar la ronda y revisar el ganador:", error);
            }
        };
        if (ronda > 3) {
            setTimeout(() => {
                manejarRonda();
            }, 2000); 
        }
    }, [ronda]);

    // Mostrar el pop-up cuando el estado de ganador cambia
    useEffect(() => {
        if (ganador != null) {
            setShowEnding(true); // Mostrar pop-up
            console.log("Juego terminado");
        }
    }, [ganador]);

    const leaveMatch = () => {
        // Eliminamos Jugador (y Partida si este es el ultimo jugador en ella)
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/partidas/${nombre}`)
        .then((response) => {
            console.log('Respuesta eliminado Jugador/Partida:', response.data);
            window.location.href = '/usercheck';
        }).catch((error) => {
            console.log(error);
        });
    };
    
    return (
        <div className="fight-container">
        {showPopup && (
            <div className="popup-seleccion">
                <p>{mensaje}</p>
            </div>
        )}
        <div className={`app-container ${showEnding ? 'blurred' : ''}`}>
        <table className='estructura'>
            <tbody>
            <tr className="fila1">
                <td className="ronda izquierda">
                    {Object.values(jugadaJ).map((c, index) => (
                        <div key={index} >
                            {c !== null ? (
                                <Carta 
                                    elementoId={c.elementoId}
                                    cartaId={c.cartaId}
                                    nivel={c.nivel}
                                />
                            ) : (
                                <div className="carta-default-container">
                                    <img id="imagen" src={`./assets/imgs/default_carta.png`} className="carta-default-arcano" />
                                </div>
                            )}
                        </div>
                    ))}
                </td>

                <td className="puntos">
                    <h1>{puntajeJ} - {puntajeO}</h1>
                </td>

                <td className="ronda derecha">
                    {Object.values(jugadaO).map((c, index) => (
                        <div key={index}>
                            {c !== null ? (
                                <Carta 
                                    elementoId={c.elementoId}
                                    cartaId={c.cartaId}
                                    nivel={c.nivel}
                                />
                            ) : (
                                <div className="carta-default-container">
                                    <img id="imagen" src={`./assets/imgs/default_carta.png`} className="carta-default-arcano" />
                                </div>
                            )}
                        </div>
                    ))}
                </td>
            </tr>
            <tr className="fila2">
                <div className="confirm-button">
                    {habilidad && (
                        <button className="button-habilidad" onClick={handleHabilidad}>Usar habilidad</button>
                    )}
                    <button className="button-confirmar" onClick={handleConfirm} disabled={isButtonDisabled}>Confirmar carta</button>
                </div>
                <td className="select">
                    {selectedJ !== null ? (
                        <Carta 
                            elementoId={selectedJ.elementoId}
                            cartaId={selectedJ.cartaId}
                            nivel={selectedJ.nivel}
                        />
                    ) : (
                        <div className="carta-default-container">
                            <img id="imagen" src={`./assets/imgs/default_carta.png`} className="carta-default-arcano" />
                        </div>
                    )}
                </td>
                <td className="selected-oponente">
                    {selectedO !== null ? (
                        <Carta 
                            elementoId={selectedO.elementoId}
                            cartaId={selectedO.cartaId}
                            nivel={selectedO.nivel}
                        />
                    ) : (
                        <div className="carta-default-container">
                            <img id="imagen" src={`./assets/imgs/default_carta.png`} className="carta-default-arcano" />
                        </div>
                    )}
                </td>
                <td className='info'>
                    <ProgressTracker
                        isButtonDisabled={isButtonDisabled}
                        nombre={nombre}
                        oponente={oponente}
                    />
                    <PlayerInfo 
                        nombre={players_info.nombre}
                        nombre_arcano={players_info.nombre_arcano}
                        estrellas={players_info.estrellas} 
                        vidas={players_info.vidas}
                    /> 
                </td>
            </tr>
            <tr className="mazo-container">
                {isButtonDisabled ? (
                    <td>
                        <div className="mazo-div">
                            <p>Esperando la jugada de tu oponente...</p>
                        </div>
                    </td>
                ) : (
                    <td>
                        <Mazo
                            jugador_info={jugador_info}
                            nombre_arcano={jugador_info.nombre_arcano}
                            nombre_jugador={nombre}
                            estrellas={jugador_info.estrellas}
                            vidas={jugador_info.vidas}
                            cartas={cartas_j}
                            cartas_largo={cartas_j.length}
                            handleCartaClick={handleCartaClick}
                        />
                    </td>
                )}
            </tr>
            </tbody>
        </table>
        </div>
        <br></br>
        {showPopupHabilidad && 
            <PopupHabilidad
                nombre={nombre}
                id_oponente={oponente}
                handleCloseModal={handleCloseModal}
                id_personaje={personaje.id}
                nombre_personaje={personaje.nombre}
                alias_personaje={personaje.alias}
                descripcion_habilidad={personaje.descripcion_habilidad}
                cartas={cartas_j}
                cartas_largo={cartas_j.length}
            />
        }
        {showEnding && 
        <div className="ending">
            <div className="ending-content">
                <h1>¡Game Over!</h1>
                <div className='estrellas-container'>   
                    <h2 className='ganador'>Ganador: Jugador { ganador } </h2>
                    <img src="./assets/imgs/estrella.png" className="estrella" alt="Estrella" /><h2>{players_info.estrellas}</h2>
                </div>
                <div className="ending-div-grande">
                    <h2 className="ending-div">Jugador {nombre}</h2>
                    <table className="tabla-final">
                        <tr>
                            <td>
                                <div className="celda">
                                    <div className="estrellas-container">
                                        <img src="./assets/imgs/estrella.png" className="estrella" alt="Estrella" />
                                        <h2 className="ending-div">{jugador_info.estrellas}</h2>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="celda">
                                    <h2 className="vidas">Vidas: {jugador_info.vidas}</h2>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <button onClick={leaveMatch}>Salir de la Partida</button>
                </div>                      
            </div>
        </div>
        }
        </div>
    );
}