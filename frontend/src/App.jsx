import { useState } from 'react'
import LoginScreen from './screens/login/LoginScreen'
import RegisterScreen from './screens/register/RegisterScreen'
import Dashboard from './screens/dashboard/Dashboard'

export default function App() {
  const [screen, setScreen] = useState("login")
  const [session, setSession] = useState(null)

  if (session) {
    return <Dashboard session={session} onLogout={() => setSession(null)} />
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
      onLogin={setSession}
      onRegister={() => setScreen("register")}
    />
  )
}
