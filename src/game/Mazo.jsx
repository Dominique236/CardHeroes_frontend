import './Mazo.css'
import Carta from './Carta';

export default function Mazo({ jugador_info, nombre_arcano, nombre_jugador, estrellas, vidas, cartas, cartas_largo, handleCartaClick }){

  console.log('Rendering Mazo:', { jugador_info });

  const handleClick = (c) => {
    handleCartaClick(c);
  };

  return(
    <div className="mazo-div">
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
              <td className="mazo-player-info-container">
                <div className="mazo-arcano-container">
                  <img src={`./assets/imgs/${nombre_arcano}.png`} className="mazo-arcano" />
                </div>
                <div className="mazo-player-details">
                  <div className="mazo-nombre">{nombre_jugador}</div>
                  <div className="mazo-estrellas-container">
                    <img src="./assets/imgs/estrella.png" className="mazo-estrella" alt="Estrella" />
                    <span className='mazo-estrellas'>{estrellas}</span>
                  </div>
                  <div className='mazo-vidas'>Vidas: {vidas}</div>
                </div>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}