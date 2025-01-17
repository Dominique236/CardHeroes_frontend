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
            // Revisar si el jugador ya se encuentra en una partida (enviarlo a ella)
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/jugadores/find/${nombre}`)
            .then(response => {
            if (response.data.encontrado) {
                // Enviar al usuario a su juego
                window.location.href = '/fight';
            }
            })
            .catch(error => {
                console.error('Error verificando si ya tiene una partida en curso:', error);
            });
            // Realizar la segunda consulta para obtener jugadores
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/usuarios`)
            .then(response => {
                const sortedUsuarios = response.data.sort((a, b) => b.victorias - a.victorias);
                // Obtener los primeros 10 usuarios
                const top10Usuarios = sortedUsuarios.slice(0, 10);
                setUsuarios(top10Usuarios);
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

    const handleCreate = () => {
        setShowModal(false); 
        setCodigo("");
        setSelectedOption("2")
        setSelectedTablero("0");
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
                <h2>Crear partida</h2>
                <p>¿Estás seguro que quieres crear una sala de espera nueva para ti y otro jugador?</p>
                <form>
                    <a href='/wait'>
                        <button type="button" onClick={handleCreate}>Crear</button>
                    </a>
                </form>
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
                <h2 className='Leaderboard'>Leaderboard</h2>
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