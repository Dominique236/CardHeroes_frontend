import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Instructions from '../game/Instructions'
import AboutMe from './AboutMe'
import Choose from '../game/Choose'
import Login from '../profile/Login'
import UserCheck from '../protected/UserCheck'
import Signup from '../profile/Signup'
import LogoutButton from '../profile/Logout'
import Wait from '../game/Wait'
import Fight from '../game/Fight'

function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<App/>}/>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/aboutme'} element={<AboutMe/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/signup'} element={<Signup/>}/>
                <Route path={'/logout'} element={<LogoutButton/>}/>
                <Route path={"/usercheck"} element={<UserCheck/>}/>
                <Route path={"/wait"} element={<Wait/>}/>
                <Route path={'/choose'} element={<Choose/>}/>
                <Route path={'/fight'} element={<Fight/>}/>
            </Routes>  
        </BrowserRouter>
        </>
    )
}

export default Routing