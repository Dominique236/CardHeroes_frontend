import { useEffect , useState} from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [nombre, setNombre] = useState(localStorage.getItem('nombre') || "");

    function logout() {
        setToken(null);
        setNombre("");
    }

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    useEffect(() => {
        localStorage.setItem('nombre', nombre);
        console.log("El nombre se ha actualizado:", nombre);
    }, [nombre]);

    return (
        <AuthContext.Provider value={{ token, setToken, logout, nombre, setNombre}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;