import { Route, Routes } from 'react-router-dom'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Menu } from './pages/menu'
import { Partida } from './pages/partida'
import { Profile } from './pages/user'


export const Routing = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />}/>
        <Route path="/partida" element={<Partida />}/>
        <Route path="/profile" element={<Profile />}/>
    </Routes>
)