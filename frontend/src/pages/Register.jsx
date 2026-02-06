import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
function Register() {
  const name=useRef();
  const pass=useRef();
  const phoneRef=useRef();
  const emailRef=useRef();

  const Login = async()=>{
    const res = await axios.post("http://localhost:5000/api/user/register",{
      name:name.current.value,
      password:pass.current.value,
      phone:phoneRef.current.value,
      email:emailRef.current.value
    })
  }
  return (
    <div className="min-h-screen bg-[#f6f1e9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-[#e5d8c5] rounded-2xl shadow-[0_18px_40px_rgba(31,26,26,0.12)] p-6 md:p-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#7a6a56]">Get started</p>
          <h1 className="text-2xl font-semibold text-[#1f1a1a] mt-2">Create your account</h1>
          <p className="text-sm text-[#5b5144] mt-2">Set up your profile to begin chatting.</p>
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
            placeholder="Choose a username"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">Password</label>
          <input
            ref={pass}
            type="password"
            placeholder="Create a password"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">Email</label>
          <input
            ref={emailRef}
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">Phone</label>
          <input
            ref={phoneRef}
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
          />
        </div>
        <button type='submit' className="w-full px-6 py-3 rounded-full bg-[#1f1a1a] text-white text-sm tracking-[0.2em] uppercase hover:bg-[#3a2f2f] transition">
          Register
        </button>
        <p className="text-center text-sm text-[#5b5144]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1f1a1a] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
      </div>
    </div>
  )
}

export default Register
