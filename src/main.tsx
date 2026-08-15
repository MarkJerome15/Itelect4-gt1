// src/main.tsx
// BrowserRouter MUST sit above App (not inside it).
// React Router's hooks (useNavigate, useParams, NavLink, etc.) need a
// Router context above them in the component tree. If App contains <Routes>,
// those hooks need the Router to already exist. Putting BrowserRouter inside
// App would mean components rendered *alongside* the Routes couldn't use
// router hooks.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
