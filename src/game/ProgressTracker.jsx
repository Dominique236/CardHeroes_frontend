import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressTracker = ({ isButtonDisabled, nombre, oponente }) => {
    const [progress, setProgress] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (!isButtonDisabled) {
            // Cuando el botón se activa, comienza el tiempo
            setStartTime(Date.now());
        } else if (startTime) {
            // Cuando el botón se desactiva, calcula el tiempo transcurrido
            const elapsedTime = Date.now() - startTime;
            const addedPercentage = calculatePercentage(elapsedTime);

            setProgress((prevProgress) => {
                const newProgress = prevProgress + addedPercentage;

                if (newProgress >= 100) {
                    onMaxProgress(); // Llama la función proporcionada cuando se alcanza el 100%
                    return 0; // Reinicia el progreso
                }
                return newProgress;
            });
            setStartTime(null); // Reinicia el tiempo
        }
    }, [isButtonDisabled, startTime]);

    const calculatePercentage = (time) => {
        // Ajusta esta lógica para determinar cuánto porcentaje se suma según el tiempo
        if (time < 20000) return 40; // Menos de 20 segundo
        if (time < 40000) return 30; // Entre 20 y 40 segundos
        if (time < 60000) return 20; // Entre 40 y 60 segundos
        return 10; // Más de 60 segundos
    };

    const onMaxProgress = () => {
        console.log("Maximo puntaje alcanzado");
        // Jugador se gana dos cartas al azar del Mazo
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/progresos/${nombre}/${oponente}`)
        .then((response) => {
            console.log("Habilidad utilizada correctamente: ", response.data);
            setMensaje(response.data.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                setMensaje("");
            }, 3000); // Oculta el popup después de 3 segundos
        })
        .catch((error) => {
            console.error('Error al utilizar el progreso:', error);
        });
    };

    return (
        <div>
            {showPopup && (
                <div className="popup-seleccion">
                    <p>{mensaje}</p>
                </div>
            )}
            <div>Progreso acumulado: {progress}%</div>
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    height: '10px',
                    width: '100%',
                    backgroundColor: '#ddd',
                    marginTop: '10px',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#4caf50',
                    }}
                />
                {showTooltip && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '-30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '5px 10px',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            borderRadius: '5px',
                            fontSize: '12px',
                            zIndex: 10,
                        }}
                    >
                        La barra de progreso indica tu avance para conseguir 2 cartas más para tu mazo. 
                        ¡Mientras más rápido escojas tu jugada más aumentará!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressTracker;
