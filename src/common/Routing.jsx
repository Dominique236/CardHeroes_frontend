import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Instructions from '../game/Instructions'
import AboutMe from './AboutMe'
import Choose from '../game/Choose'

function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<App/>}/>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/aboutme'} element={<AboutMe/>}/>
                <Route path={'/choose'} element={<Choose/>}/>
            </Routes>  
        </BrowserRouter>
        </>
    )
}

export default Routing