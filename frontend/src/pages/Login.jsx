import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const name=useRef();
  const pass=useRef();
  const navigate=useNavigate();
  const Login = async()=>{
    const res = await axios.post("http://localhost:5000/api/user/login",{
      name:name.current.value,
      password:pass.current.value
    })
    if(res.status=200){
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("phone",res.data.phone);
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen bg-[#f6f1e9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-[#e5d8c5] rounded-2xl shadow-[0_18px_40px_rgba(31,26,26,0.12)] p-6 md:p-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#7a6a56]">Welcome back</p>
          <h1 className="text-2xl font-semibold text-[#1f1a1a] mt-2">Sign in to continue</h1>
          <p className="text-sm text-[#5b5144] mt-2">Jump back into your conversations.</p>
        </div>
        <form className='space-y-4' action="" onSubmit={(e)=>{
        e.preventDefault();
        Login();
      }}>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">Username</label>
          <input
            ref={name}
            type="text"
            placeholder="Enter your username"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">Password</label>
          <input
            ref={pass}
            type="password"
            placeholder="Your password"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <button type='submit' className="w-full px-6 py-3 rounded-full bg-[#1f1a1a] text-white text-sm tracking-[0.2em] uppercase hover:bg-[#3a2f2f] transition">
          Login
        </button>
        <p className="text-center text-sm text-[#5b5144]">
          New here?{" "}
          <Link to="/register" className="text-[#1f1a1a] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
      </div>
    </div>
  )
}

export default Login
