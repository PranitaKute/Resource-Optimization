import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Verify() {
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify?token=${encodeURIComponent(token || '')}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Verification failed')
        setMessage('Verified! You can now log in.')
        setTimeout(()=> window.location.href = '/login', 1500)
      } catch (e) {
        setMessage(e.message)
      }
    }
    run()
  }, [])

  return (
    <div className="container">
      <div className='form-container'>
        <div className='form'>
          <h2>Email Verification</h2>
          <div className='form-message'>{message}</div>
        </div>
      </div>
    </div>
  )
}


