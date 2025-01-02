import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Choose = () => {
    const [personajes, setPersonajes] = useState([]); 

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/personajes`)
          .then((response) => {
            const data = response.data;
            console.log(data);
            setPersonajes(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, [])
    
    return(
        <>
            <h2>Personajes</h2>
            <ul>
                {personajes.map((personaje) => (
                <li key={personaje.id}>
                    <h3>{personaje.nombre}</h3>
                    <p><strong>Alias:</strong> {personaje.alias}</p>
                    <p><strong>Elemento:</strong> {personaje.elemento}</p>
                    <p><strong>Color:</strong> {personaje.color}</p>
                </li>
                ))}
            </ul>
            <br></br>
        </>
    )
}

export default Choose;