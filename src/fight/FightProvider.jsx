import { useEffect , useState} from "react";
import { FightContext } from "./FightContext";

function FightProvider({ children }) {
    const [oponente, setOponente] = useState(localStorage.getItem('oponente') || "");

    useEffect(() => {
        localStorage.setItem('oponente', oponente);
        console.log("El oponente se ha actualizado:", oponente);
    }, [oponente]);

    return (
        <FightContext.Provider value={{oponente, setOponente}}>
            {children}
        </FightContext.Provider>
    );
}

export default FightProvider;