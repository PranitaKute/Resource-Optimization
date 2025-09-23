import React, { useState } from 'react';
import './Login.css';
import login from '../../assets/login.png';
import register from '../../assets/add.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // container
    <div className="container">
      {/* form container */}
      <div className='form-container'>
        {/* form toggle */}
        <div className='form-toggle'>
          <button className= {isLogin ? 'active' : ''} onClick={()=>setIsLogin(true)}>
            <img src={login} alt='login'/>
            Login
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={()=>setIsLogin(false)}>
            <img src={register} alt='register'/>
            Register

          </button>
        </div>
        {/* Login form */}
        {isLogin ? <>
            <div className='form'>
                <h2>WELCOME BACK</h2>
                <input type='email' placeholder='Enter your Email'></input>
                <input type='password' placeholder='Enter your Password'></input>
                <a href='#'>Forgot Password</a>
                <button>LOGIN</button>
            </div>
        </> : <>
        <div className='form'>
          <h2>Create an Account</h2>
          <input type='text' placeholder='Enter your Name'></input>
          <input type='email' placeholder='Enter your Email'></input>
          {/* <label htmlFor="usertype">User Type</label> */}
          <select id='usertype' name='usertype'>
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Labincharge">Lab Incharge</option>
          </select>
          <input type='password' placeholder='Enter your Password'></input>
          <button>CREATE ACCOUNT</button>
        </div>
        </>}

      </div>
    </div>

  )
}

export default Login
