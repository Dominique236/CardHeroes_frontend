import React, {useContext, useState} from 'react';
import './Login.css';
import { AuthContext } from '../auth/AuthContext';

const LogoutButton = () => {
  const {logout} = useContext(AuthContext);
  const [msg, setMsg] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);


  const handleLogout = () => {
    logout();
    setLoggedOut(true);
    if (loggedOut) {
      setMsg("Ya cerraste sesión. No estás logeado.");
      alert("Ya cerraste sesión. No estás logeado.");
    } else {
      setMsg("Has hecho logout con éxito!");
      alert("Has hecho logout con éxito!");
    }
  }

  return (
    <>
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}
      {loggedOut ? 
      <div className="logoutMessage">Ya cerraste sesión. No estás logeado.</div> :
      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
      }
    </>
  );
}

export default LogoutButton;