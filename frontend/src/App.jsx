import './App.css'
import Login from './pages/login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Profile from './pages/Profile'

import './index.css'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
