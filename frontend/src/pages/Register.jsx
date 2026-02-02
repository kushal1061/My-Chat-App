import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
function Register() {
  const name=useRef();
  const pass=useRef();
  const phoneRef=useRef();
  const emailRef=useRef();

  const Login = async()=>{
    const res = await axios.post("http://localhost:3000/api/user/register",{
      name:name.current.value,
      password:pass.current.value,
      phone:phoneRef.current.value,
      email:emailRef.current.value
    })
  }
  return (
    <div>
      <form className='form' action="" onSubmit={(e)=>{
        e.preventDefault();
        Login();
      }}>
        <div>
          Username <input ref={name} type="text" />
        </div>
        <div>
          Password  <input ref={pass} type="password" />
        </div>
        <div>
          email  <input ref={emailRef} type="password" />
        </div>
        <div>
          Phone  <input ref={phoneRef} type="password" />
        </div>
        <button type='submit'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Register