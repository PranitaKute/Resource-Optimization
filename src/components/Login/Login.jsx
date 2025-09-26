import React, { useState } from 'react';
import './Login.css';
import login from '../../assets/login.png';
import register from '../../assets/add.png';
import mail from '../../assets/email.png';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = () => {
    const payload = {
      email: email,
      password: password
    }
    console.log("output", payload);

    // post method
    axios.post('http://api.escuelajs.co/api/v1/auth/login', payload)
    .then((res) => {
      alert("Login Successfull!");
      console.log("Login Successful!", res);
    })
    .catch((err)=>{
      alert("Login Failed!")
      console.log("Login Failed", err);
    })
  
  }

  return (
    // container
    <div className="container">
      {/* form container */}
      <div className='form-container'>
        {/* form toggle */}
        <div className='form-toggle'>
          <button className= {isLogin ? 'active' : ''} 
          onClick={()=>{setIsLogin(true)}}>
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
                {/* <img src = {email} alt="" /> */}
                <input onChange={(e)=> setEmail(e.target.value)} type='email' placeholder='Enter your Email'></input>
                <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Enter your Password'></input>
                <a href='#'>Forgot Password</a>
                <button onClick = {() => handleSubmit()}>LOGIN</button>
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
