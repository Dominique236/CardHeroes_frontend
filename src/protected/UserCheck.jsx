import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { WaitContext } from '../wait/WaitContext';
import './UserCheck.css';
import LogoutButton from '../profile/Logout'

export default function UserCheck() {
    const { token, nombre } = useContext(AuthContext)
    const [status, setStatus] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del pop-up de create
    const [showModalTableros, setShowModalTableros] = useState(false);
    const [showModalSearch, setShowModalSearch] = useState(false); // Estado para controlar la visibilidad del pop-up de search
    const { selectedOption, setSelectedOption, codigo, setCodigo, selectedTablero, setSelectedTablero } = useContext(WaitContext);
    
    console.log("Valor actual de selectedOption:", selectedOption);
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
            // (**) Revisar si el jugador ya se encuentra en una partida (enviarlo a ella)
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadores/find/${nombre}`)
            .then(response => {
            if (response.data.encontrado) {
                // Enviar al usuario a su juego
                window.location.href = '/board';
            }
            })
            .catch(error => {
            console.error('Error verificando si ya tiene una partida en curso:', error);
            });
            // Realizar la segunda consulta para obtener jugadores
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/usuarios`)
            .then(response => {
            const sortedUsuarios = response.data.sort((a, b) => b.victorias - a.victorias);
            setUsuarios(sortedUsuarios);
            })
            .catch(error => {
            console.error('Error fetching usuarios:', error);
            });
        })
        .catch(error => {
            setStatus(error.message);
            setIsLoggedIn(false); // Si el usuario no está logeado
        });
    }, [token]);

    //LOGICA DE CREACION DE JUEGO
    const handleCreateGameClick = () => {
        setShowModal(true); // Mostrar el pop-up
    };

    const handleCloseModal = () => {
        setShowModal(false); // Ocultar el pop-up
    };
    const handleShowModalTableros = () => {
        setShowModalTableros(true);
        setShowModal(false);
    };
    const handleCreate = () => {
        // Lógica para manejar la creación del juego
        if (selectedTablero !== "") { // Solo si se ha seleccionado una opción
        setShowModalTableros(false); // Ocultar el pop-up después de crear el juego
        setCodigo("");
        } else {
        alert("Por favor selecciona una opción antes de crear el juego.");
        }
    };

    //LOGICA JUGAR
    const handlePlay = () => {
        setCodigo("");
        setSelectedOption("");
        setSelectedTablero("0");
    };

    //LOGICA DE BUSCAR UN JUEGO 
    const handleSearchGameClick = () => {
        setShowModalSearch(true); // Mostrar el pop-up
    };

    const handleCloseModalSearch = () => {
        setShowModalSearch(false); // Ocultar el pop-up
    };

    const handleSearch = () => {
        // Lógica para manejar la busqueda del juego
        if (codigo !== "") { 
        setShowModal(false); // Ocultar el pop-up después de buscar el juego
        setSelectedOption("");
        } else {
        alert("Por favor escribe el codigo antes de buscar el juego.");
        }
    };

    return (
        <>
            <div>
            {isLoggedIn && (
                <div className="header">
                <div className="volver">
                    <div className="arrow-left"></div>
                    <a href="/">Volver</a>
                </div>
                <div className="user-info">
                    <a>Mi usuario: {nombre}</a>
                    <div className="logout">
                        {nombre && <LogoutButton />}
                    </div>
                </div>
                </div>
            )}
            </div>
            
            <div>
            {isLoggedIn && (
                <div className="buttons-container">
                <button className="button-cafe" onClick={handleCreateGameClick}>
                    Crear partida
                </button>
                <a href="/wait" className="button-rojo">
                    <button onClick={handlePlay}>JUGAR</button>
                </a>
                <button className="button-cafe" onClick={handleSearchGameClick}>
                    Buscar partida
                </button>
                </div>
            )}
            </div>

            {showModal && 
            <div className="modal">
                <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h2>Jugadores</h2>
                <p>Selecciona la cantidad de jugadores de la sala</p>
                <form>
                    <label>
                    <input type="radio" name="players" value="2" onChange={() => setSelectedOption("2")} /> 2 jugadores
                    </label><br />
                    <label>
                    <input type="radio" name="players" value="3" onChange={() => setSelectedOption("3")} /> 3 jugadores
                    </label><br />
                    <label>
                    <input type="radio" name="players" value="4" onChange={() => setSelectedOption("4")} /> 4 jugadores
                    </label><br /><br />
                    {selectedOption && 
                    <button type="button" onClick={handleShowModalTableros}>Seleccionar</button>
                    }
                </form>
                </div>
            </div>
            }

            {showModalTableros && 
            <div className="modal">
                <div className="modal-content">
                <h2>Tableros</h2>
                <p>Selecciona el tablero que quieres usar en esta partida</p>
                <form className="grid-container">
                    <div className="grid-item">
                    <img className='tablero' id='tablero-rapido' src={`./assets/imgs/tablero1.png`} alt='Tablero rapido'/>
                    <input type="radio" name="players" value="1" onChange={() => setSelectedTablero("1")} /> Tablero Rapido
                    </div>
                    <div className="grid-item">
                    <img className='tablero' id='tablero-rodri' src={`./assets/imgs/tablero3.png`} alt='Tablero rodri'/>
                    <input type="radio" name="players" value="2" onChange={() => setSelectedTablero("2")} /> Tablero Rombo
                    </div>
                    <div className="grid-item">
                    <img className='tablero' id='tablero-romi' src={`./assets/imgs/tablero2.png`} alt='Tablero romi'/>
                    <input type="radio" name="players" value="3" onChange={() => setSelectedTablero("3")} /> Tablero Original
                    </div>
                </form>
                <br></br>
                {selectedTablero && <a href='/wait'>
                    <button type="button" onClick={handleCreate}>Crear</button>
                    </a> }
                </div>
            </div>
            }

            {showModalSearch && 
            <div className="modal">
                <div className="modal-content">
                <span className="close" onClick={handleCloseModalSearch}>&times;</span>
                <h2>Ingrese el código</h2>
                <p>Ingrese el código de la sala a la que quiere ingresar</p>
                <form>
                    <label>
                    <input 
                    type="text" 
                    name="codigo" 
                    value={codigo} 
                    onChange={(e) => setCodigo(e.target.value)} 
                    />
                    </label><br /><br />
                    {codigo && <a href='/wait'>
                    <button type="button" onClick={handleSearch}>Enviar</button>
                    </a> }
                </form>
                </div>
            </div>
            }

            <div>
            {isLoggedIn && (
                <div>
                <br></br>
                <h2>Leaderboard</h2>
                <table className="leaderboard-table">
                    <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Usuario</th>
                        <th>Victorias</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr key={index}>
                        <td className="rank">{index + 1}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.victorias}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
            <br></br>
            <br></br>
            <br></br>

            <div>
            {!isLoggedIn && <h2>Necesitas logearte para jugar!</h2>}
            </div>
        </>
    )
}