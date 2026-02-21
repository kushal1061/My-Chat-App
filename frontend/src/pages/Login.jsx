```javascript
import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const name = useRef();
  const pass = useRef();
  const navigate = useNavigate();
  const Login = async () => {
    const res = await axios.post("http://localhost:5000/api/user/login", {
      name: name.current.value,
      password: pass.current.value
    })
    if (res.status = 200) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("phone", res.data.phone);
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Welcome back</h1>
          <p className="text-secondary-500 mt-2 text-sm">Sign in to continue your conversations</p>
        </div>
        <form className='space-y-6' action="" onSubmit={(e) => {
          e.preventDefault();
          Login();
        }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Username</label>
            <input
              ref={name}
              type="text"
              placeholder="Enter your username"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Password</label>
            <input
              ref={pass}
              type="password"
              placeholder="Your password"
              className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button type='submit' className="w-full px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors shadow-lg shadow-primary-500/20">
            Sign In
          </button>
          <p className="text-center text-sm text-secondary-500">
            New here?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
```
