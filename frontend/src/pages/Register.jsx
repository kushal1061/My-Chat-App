import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
function Register() {
  const name = useRef();
  const pass = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();

  const Login = async () => {
    const res = await axios.post("http://localhost:5000/api/user/register", {
      name: name.current.value,
      password: pass.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value
    })
  }
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Create Account</h1>
          <p className="text-secondary-500 mt-2 text-sm">Join us and start messaging today</p>
        </div>
        <form className='space-y-5' action="" onSubmit={(e) => {
          e.preventDefault();
          Login();
        }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Username</label>
            <input
              ref={name}
              type="text"
              placeholder="Choose a username"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Password</label>
            <input
              ref={pass}
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Email</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Phone</label>
            <input
              ref={phoneRef}
              type="tel"
              placeholder="Phone number"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button type='submit' className="w-full px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors shadow-lg shadow-primary-500/20">
            Register
          </button>
          <p className="text-center text-sm text-secondary-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
