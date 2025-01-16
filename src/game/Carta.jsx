import './Carta.css'

export default function Carta({elementoId, cartaId, nivel}) {

  return (
    <div className="carta-container">
      <img id='imagen' src={`./assets/imgs/${elementoId}_carta.png`} className="carta-arcano" />
      <div id='nivel' className="carta-nivel">{nivel}</div>
    </div>
  );
}