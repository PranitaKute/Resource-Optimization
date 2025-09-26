import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const FRONTEND_URLS = (process.env.FRONTEND_URLS || FRONTEND_URL)
  .split(',')
  .map(s => s.trim())

// CORS: allow one or many frontend origins (localhost, 127.0.0.1, custom ports)
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // allow non-browser tools
    const ok = FRONTEND_URLS.some(allowed => origin === allowed || origin.startsWith(allowed))
    return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json())

// SQLite setup
sqlite3.verbose()
const db = new sqlite3.Database('./auth.db')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password_hash TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
  // Ensure username column exists for older DBs
  db.all('PRAGMA table_info(users)', (err, rows) => {
    if (!err && Array.isArray(rows)) {
      const hasUsername = rows.some(r => r.name === 'username')
      if (!hasUsername) {
        db.run('ALTER TABLE users ADD COLUMN username TEXT UNIQUE', () => {})
      }
    }
  })
})

// email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
})

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password)
}

function isValidPhone(phone) {
  return /^\d{7,15}$/.test(phone)
}

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, phoneNumber, password, confirmPassword } = req.body
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username || '')) return res.status(400).json({ message: 'Invalid username' })
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email' })
    if (!isValidPhone(phoneNumber || '')) return res.status(400).json({ message: 'Invalid phone number' })
    if (!isStrongPassword(password)) return res.status(400).json({ message: 'Weak password' })
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' })

    // Ensure uniqueness for username and email
    db.get('SELECT id FROM users WHERE lower(username) = lower(?) OR lower(email) = lower(?)', [username, email], function (findErr, row) {
      if (findErr) return res.status(500).json({ message: 'Database error' })
      if (row) return res.status(409).json({ message: 'Username or email already registered' })

      db.run(
      'INSERT INTO users (username, email, phone_number, password_hash, verification_token) VALUES (?, ?, ?, ?, ?)',
      [username, email.toLowerCase(), phoneNumber, passwordHash, verificationToken],
      function (err) {
        if (err) {
          if (err.message && err.message.includes('UNIQUE')) {
            return res.status(409).json({ message: 'Username or email already registered' })
          }
          return res.status(500).json({ message: 'Database error' })
        }

        const verifyUrl = `${FRONTEND_URL}/verify?token=${verificationToken}`
        const mailOptions = {
          from: process.env.MAIL_FROM || 'no-reply@example.com',
          to: email,
          subject: 'Verify your email',
          html: `<p>Click to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
        }

        transporter.sendMail(mailOptions).catch(() => {})
        return res.json({ message: 'Registered. Please verify your email.' })
      }
    )
    })
  } catch (e) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// Verify email
app.get('/api/auth/verify', (req, res) => {
  const { token } = req.query
  if (!token) return res.status(400).json({ message: 'Missing token' })
  try {
    const { email } = jwt.verify(String(token), JWT_SECRET)
    db.run(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ? AND verification_token = ?',
      [email.toLowerCase(), token],
      function (err) {
        if (err) return res.status(500).json({ message: 'Database error' })
        if (this.changes === 0) return res.status(400).json({ message: 'Invalid or expired token' })
        return res.json({ message: 'Email verified. You can now log in.' })
      }
    )
  } catch (e) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
})

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username || '')) return res.status(400).json({ message: 'Invalid username' })
  if (!password) return res.status(400).json({ message: 'Password required' })

  db.get('SELECT * FROM users WHERE lower(username) = lower(?)', [username], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (!user.is_verified) return res.status(403).json({ message: 'Email not verified' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, phoneNumber: user.phone_number } })
  })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`)
})


