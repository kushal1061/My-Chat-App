import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Profile from './pages/Profile'
import Call from './pages/Call'
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
        {/* <Route path="/" element={<Call />} /> */}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
