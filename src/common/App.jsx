import React, { useContext } from 'react'
import './App.css'
// import LogoutButton from '../profile/Logout'
// import { AuthContext } from '../auth/AuthContext';

function App() {
  // const { nombre } = useContext(AuthContext);

  return (
    <>
      {/* <div className="logout">
        {nombre && <LogoutButton />}
      </div> */}
      <br></br>
      <div className="welcome">
        <h1>CardHeroes</h1>
        <h3>Sumérgete en el emocionante mundo de CardHeroes, un juego de cartas de batalla 1 contra 1 donde cada enfrentamiento es una prueba de estrategia y poder.</h3>
        <h3>Elige entre personajes elementales como Inferno, Aquos, Aeria, y Terrax, cada uno con habilidades únicas que pueden cambiar el curso de la batalla.</h3>
        <h3>Despliega tus cartas, usa tus habilidades especiales y domina los elementos para derrotar a tus oponentes.</h3>
        <h3>¿Tienes lo necesario para convertirte en el héroe definitivo? ¡Únete a la batalla y descúbrelo!</h3>
      </div>
      <br></br>
      <div className="instructions-button">
        <a href='/instructions'>
          <button>Saber más</button>
        </a>
      </div>
    </>
  )
}

export default App;