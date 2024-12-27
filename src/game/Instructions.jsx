import './Instructions.css'

function Instructions() {
    return (
        <>
            <h2>¿Cómo jugar?</h2>
            <p>Sigue estos sencillos pasos para comenzar tu aventura y convertirte en el héroe definitivo:</p>
            <ol>
                <li><span className="highlight">Elige tu personaje:</span> Selecciona tus héroes elementales favoritos: Inferno (Fuego), Aquos (Agua), Aeria (Aire) y Terrax (Tierra). Cada héroe tiene habilidades únicas que pueden cambiar el curso de la batalla.</li>
                <li><span className="highlight">Forma tu baraja:</span> Crea una baraja de cartas con tus héroes y habilidades especiales. Asegúrate de equilibrar tus cartas para maximizar tus estrategias en el campo de batalla.</li>
                <li><span className="highlight">Despliega tus cartas:</span> En cada turno, ambos jugadores eligen una carta para desplegar. Las cartas se enfrentan en una batalla directa donde el nivel y el elemento determinarán el ganador.</li>
                <li><span className="highlight">Usa tu habilidad especial:</span> Aprovecha las habilidades especiales de tus héroes para obtener ventaja.</li>
                <li><span className="highlight">Gana la batalla:</span> El jugador con la carta de mayor nivel y ventaja elemental gana la batalla. Sigue desplegando cartas y utilizando habilidades hasta que un jugador sea declarado vencedor.</li>       
                <li><span className="highlight">Conviértete en el héroe definitivo:</span> Domina los elementos, perfecciona tus estrategias y derrota a tus oponentes para ascender en los rankings y convertirte en el héroe definitivo de CardHeroes.</li>     
            </ol>
            <p>¿Estás listo para el desafío? ¡Únete a la batalla y demuestra tu valía en CardHeroes! </p>
            

            <h2>¿Combate? ¿Cartas?</h2>
            <p><span className="highlight">Cartas Elementales:</span> Cada jugador posee cartas enumeradas del 1 al 8 representando los poderosos elementos del juego. ¿Serás capaz de utilizarlas sabiamente para superar a tus rivales?</p>
            <p><span className="highlight">Estrategia en cada Movimiento:</span> Elige tus cartas con astucia y anticipa los movimientos de tus oponentes. ¡La estrategia es tu mejor aliada!</p>
            <p><span className="highlight">Desafíos Épicos:</span> Enfréntate a tus amigos en emocionantes duelos de cartas y demuestra quién es el verdadero maestro del elemento. ¡Elige tus cartas, ejecuta tus estrategias y reclama la victoria!</p>
            <img src="./assets/imgs/mazo.png" className="mazo"></img>
            <br></br>
            
            <a href='/'>
                <button>Volver</button>
            </a>
            <br></br>
            <br></br>
        </>
    )
}

export default Instructions