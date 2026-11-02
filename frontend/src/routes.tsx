import { Route, Routes } from 'react-router-dom'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Menu } from './pages/menu'

export const Routing = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />}/>
    </Routes>
)