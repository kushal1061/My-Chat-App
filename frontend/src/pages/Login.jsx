import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
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
        <button type='submit'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login