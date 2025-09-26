import React, { useMemo, useState } from 'react'
import '../Login/Login.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [remember, setRemember] = useState(false)

  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) e.username = 'Invalid email'
    if (!password) e.password = 'Password required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setMessage('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      setMessage('Login successful! Redirecting...')
      window.location.href = '/'
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className='form-container auth-card'>
        <div className='form'>
          <h2 className='auth-title'>Login</h2>
          <form onSubmit={onSubmit} noValidate>
            <div className='with-icon icon-mail'>
              <input type='email' placeholder='Enter your email' value={username} onChange={(e)=>setUsername(e.target.value)} className={errors.username ? 'error' : ''} />
            </div>
            {errors.username && <div className='field-error'>{errors.username}</div>}
            <div className='password-field with-icon icon-lock'>
              <input type={showPassword ? 'text' : 'password'} placeholder='Confirm a password' value={password} onChange={(e)=>setPassword(e.target.value)} className={errors.password ? 'error' : ''} />
              <button type='button' className='btn-eye' onClick={()=>setShowPassword(s=>!s)} aria-label='Toggle password visibility'>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <div className='field-error'>{errors.password}</div>}
            <div className='row-inline'>
              <label className='left'><input type='checkbox' checked={remember} onChange={(e)=>setRemember(e.target.checked)} /> Remember me</label>
              <a href="#">Forgot password?</a>
            </div>
            <button type='submit' className='btn-primary wide' disabled={loading}>{loading ? 'Logging in...' : 'Login Now'}</button>
          </form>
          {message && <div className='form-message'>{message}</div>}
          <div className='alt-actions'>
            <span>Don't have an account?</span>
            <a href='/register'>Signup now</a>
          </div>
        </div>
      </div>
    </div>
  )
}


