import { useState } from 'react'
import LoginScreen from './screens/login/LoginScreen'
import RegisterScreen from './screens/register/RegisterScreen'
import Dashboard from './screens/dashboard/Dashboard'

const SESSION_KEY = 'estoque_session'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [screen, setScreen] = useState("login")
  const [session, setSession] = useState(loadSession)

  function handleLogin(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    setSession(data)
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }

  if (session) {
    return <Dashboard session={session} onLogout={handleLogout} />
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onBack={() => setScreen("login")}
        onSuccess={() => setScreen("login")}
      />
    )
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onRegister={() => setScreen("register")}
    />
  )
}
