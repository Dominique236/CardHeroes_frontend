import React, { useState } from 'react';
import Carta from './Carta';
import axios from 'axios';
import './PopupHabilidad.css'

export default function PopupHabilidad({nombre, id_oponente, handleCloseModal, id_personaje, nombre_personaje, alias_personaje, descripcion_habilidad, cartas, cartas_largo}){
    const [selectedOption, setSelectedOption] = useState(null);

    const [showCartas, setShowCartas] = useState(false);
    const [selectedCarta, setSelectedCarta] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const handleUsarHabilidad = () => {
        console.log("Usando habilidad");
        if (id_personaje === 3 || selectedOption === 2) {
            // No muestra popupCartas
            usarHabilidad();
        } else {
            // Muestra popupCartas
            setShowCartas(true);
        }
    };

    const handleClick = (c) => {
        console.log("Selected Carta: ", c);
        setSelectedCarta(c.cartaId);
    };

    const usarHabilidad = (cartaId = null) => {
        console.log("Usando endpoint con carta: ", cartaId);
        console.log("Usando endpoint con selectedOption: ", selectedOption);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/personajes/${nombre}/${id_oponente}/${selectedOption}/${cartaId || "default"}`)
        .then((response) => {
            console.log("Habilidad utilizada correctamente: ", response.data);
            setMensaje(response.data.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                setMensaje("");
                handleCloseModal();
            }, 3000); // Oculta el popup después de 3 segundos
        })
        .catch((error) => {
            console.error('Error al utilizar habilidad:', error);
        });
    };
    
    return(
        <>
        {showPopup && (
            <div className="popup-seleccion">
                <p>{mensaje}</p>
            </div>
        )}
        <div className="modal">
            <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Habilidad</h2>
            <div className="ending-div-grande">
                <p>{nombre_personaje}, {alias_personaje}</p>
                <p>{descripcion_habilidad}</p>
            </div>
            <p>Elige en quien deseas aplicar tu habilidad</p>
            <form>
                <label>
                <input type="radio" name="players" value="1" onChange={() => setSelectedOption(1)} />Usar habilidad en mi
                </label><br />
                <label>
                <input type="radio" name="players" value="2" onChange={() => setSelectedOption(2)} />Usar habilidad en oponente
                </label><br /><br />
                {selectedOption && 
                <button type="button" onClick={handleUsarHabilidad}>Seleccionar</button>
                }
            </form>
            </div>
        </div>
        {showCartas && 
        <div className="modal">
            <div className="modal-content2">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Carta a Elegir</h2>
            <div className="mazo-div2">
                <table className='mazo-table'>
                <tbody>
                    <tr>
                        <td>
                        {
                        [...cartas, ...Array(10 - cartas_largo).fill({})].map((c, index) => (
                        <td key={index} onClick={() => handleClick(c)}>
                            {c.elementoId !== undefined ? (
                            <Carta 
                                elementoId={c.elementoId}
                                cartaId={c.cartaId}
                                nivel={c.nivel}
                            />
                            ) : (
                            <div className="carta-default-container">
                                <img id='imagen' src={`./assets/imgs/default_carta.png`} className="carta-default-arcano"/>
                            </div>
                            )}
                        </td>
                        ))}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            {selectedCarta && 
                <button type="button" onClick={() => usarHabilidad(selectedCarta)}>Seleccionar</button>
            }
            </div>
        </div>
        }
        </>
    )
}