<<<<<<< HEAD
# Resource Optimization
=======
# Resource Optimization - Auth & Landing Enhancements

## Setup

### Prerequisites
- Node.js 18+

### Backend (Express + SQLite)
1. Open a second terminal.
2. Install dependencies:
```
cd server
npm i
```
3. Create `.env` in `server/`:
```
PORT=4000
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM="ResOp <no-reply@example.com>"
```
4. Start server:
```
npm run dev
```
SQLite file `auth.db` will be created with `users` table:
`(id, email, phone_number, password_hash, is_verified, verification_token, created_at)`

### Frontend
1. Install deps:
```
npm i
```
2. Create `.env` in project root:
```
VITE_API_BASE=http://localhost:4000
```
3. Start:
```
npm run dev
```

## Features
- Register with email, phone, password strength checks, confirm password
- Email verification via link
- Login only after verification
- Animated landing page with Login/Register CTAs

## Endpoints
- POST `/api/auth/register` { email, phoneNumber, password, confirmPassword }
- GET `/api/auth/verify?token=...`
- POST `/api/auth/login` { email, password }

## Notes
- Passwords hashed with bcrypt
- JWT used for login response token
- Uses SQLite; you can switch to MySQL by replacing sqlite3 usage in `server/index.js`
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> b864864 (My latest changes before pulling)
