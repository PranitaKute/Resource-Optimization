import React, { useMemo, useState } from 'react'
import '../Login/Login.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)

  const strength = useMemo(()=>{
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^\w\s]/.test(password)) score++
    return score
  }, [password])

  const validate = () => {
    const e = {}
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) e.username = '3-20 chars, letters/numbers/_'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email'
    if (!/^\d{7,15}$/.test(phone)) e.phone = 'Phone must be 7-15 digits'
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password)) e.password = 'Min 8 chars incl upper, lower, number, special'
    if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setMessage('')
    if (!validate()) return
    if (!agree){ setMessage('Please accept terms & conditions'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phoneNumber: phone, password, confirmPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setMessage('Registered! Check your email to verify. Redirecting to login...')
      setTimeout(()=> window.location.href = '/login', 1500)
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
          <h2 className='auth-title'>Registration</h2>
          <form onSubmit={onSubmit} noValidate>
            <div className='with-icon icon-user'>
              <input type='text' placeholder='Enter your name' value={username} onChange={(e)=>setUsername(e.target.value)} className={errors.username ? 'error' : ''} />
            </div>
            {errors.username && <div className='field-error'>{errors.username}</div>}
            <div className='with-icon icon-mail'>
              <input type='email' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} className={errors.email ? 'error' : ''} />
            </div>
            {errors.email && <div className='field-error'>{errors.email}</div>}
            <div className='with-icon icon-phone'>
              <input type='tel' placeholder='Enter your Phone Number' value={phone} onChange={(e)=>setPhone(e.target.value)} className={errors.phone ? 'error' : ''} />
            </div>
            {errors.phone && <div className='field-error'>{errors.phone}</div>}
            <div className='password-field with-icon icon-lock'>
              <input type={showPassword ? 'text' : 'password'} placeholder='Create a password' value={password} onChange={(e)=>setPassword(e.target.value)} className={errors.password ? 'error' : ''} />
              <button type='button' className='btn-eye' onClick={()=>setShowPassword(s=>!s)} aria-label='Toggle password visibility'>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <div className='field-error'>{errors.password}</div>}
            <div className='password-field with-icon icon-lock'>
              <input type={showConfirm ? 'text' : 'password'} placeholder='Confirm a password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className={errors.confirmPassword ? 'error' : ''} />
              <button type='button' className='btn-eye' onClick={()=>setShowConfirm(s=>!s)} aria-label='Toggle confirm password visibility'>
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <div className='field-error'>{errors.confirmPassword}</div>}
            <div className='strength-meter'>
              <div className={`bar ${strength>=1?'on':''}`}></div>
              <div className={`bar ${strength>=2?'on':''}`}></div>
              <div className={`bar ${strength>=3?'on':''}`}></div>
              <div className={`bar ${strength>=4?'on':''}`}></div>
              <div className={`bar ${strength>=5?'on':''}`}></div>
            </div>
            <div className='row-inline'>
              <label className='left'><input type='checkbox' checked={agree} onChange={(e)=>setAgree(e.target.checked)} /> I accept all terms & conditions</label>
            </div>
            <button type='submit' className='btn-primary wide' disabled={loading}>{loading ? 'Registering...' : 'Register Now'}</button>
          </form>
          {message && <div className='form-message'>{message}</div>}
          <div className='alt-actions'>
            <span>Already have an account?</span>
            <a href='/login'>Login now</a>
          </div>
        </div>
      </div>
    </div>
  )
}


