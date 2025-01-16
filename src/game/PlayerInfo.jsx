import './PlayerInfo.css'

export default function PlayerInfo({nombre, nombre_arcano, estrellas, vidas}){

  console.log('Rendering PlayerInfo Jugador:', { nombre, nombre_arcano, estrellas, vidas });
  return(
    <div className="card">
        <table className='card-table'>
            <tr>
                <td>
                    <div>
                        <img src={`./assets/imgs/${nombre_arcano}.png`} className="arcano"></img>
                    </div>
                </td>
                <td>
                    <div className="nombre">{nombre}</div>
                    <div className="estrellas-container">
                      <img src="./assets/imgs/estrella.png" className="estrella" alt="Estrella" />
                      <span className='estrellas'>{estrellas}</span>
                    </div>
                    <div className='vidas'>Vidas: {vidas}</div>
                </td>
            </tr>
        </table>
    </div>
  )
}