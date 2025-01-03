import { useEffect , useState} from "react";
import { WaitContext } from "./WaitContext";

function WaitProvider({ children }) {
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || "");
    const [selectedTablero, setSelectedTablero] = useState(localStorage.getItem('selectedTablero') || "");
    const [codigo, setCodigo] = useState(localStorage.getItem('codigo') || "");
    const [turnos, setTurnos] = useState(localStorage.getItem('turnos') || "");

    useEffect(() => {
        localStorage.setItem('selectedOption', selectedOption);
        console.log("El selectedOption se ha actualizado:", selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        localStorage.setItem('selectedTablero', selectedTablero);
        console.log("El selectedTablero se ha actualizado:", selectedTablero);
    }, [selectedTablero]);

    useEffect(() => {
        localStorage.setItem('codigo', codigo);
        console.log("El selectedOption se ha actualizado:", codigo);
    }, [codigo]);

    useEffect(() => {
        localStorage.setItem('turnos', turnos);
        console.log("El turno se ha actualizado:", turnos);
    }, [turnos]);

    return (
        <WaitContext.Provider value={{selectedOption, setSelectedOption, codigo, setCodigo, turnos, setTurnos, selectedTablero, setSelectedTablero}}>
            {children}
        </WaitContext.Provider>
    );
}

export default WaitProvider;