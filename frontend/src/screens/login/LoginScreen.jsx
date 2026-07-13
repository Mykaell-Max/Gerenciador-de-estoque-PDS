import { useState } from 'react'
import { ShoppingCart, Eye, EyeOff } from 'lucide-react'
import { api } from '../../services/api'
import { ROLE_META } from '../../constants/roles'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import { inputCls, btnPrimary } from '../../styles/classes'

export default function LoginScreen({ onLogin, onRegister }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api("/login", "POST", { usuario: username, senha: password })
      onLogin({ name: data.nome, role: data.tipo })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex">

      <div className="hidden lg:flex lg:w-1/2 bg-[#030213] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative z-10 text-center w-full max-w-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-white text-2xl font-medium mb-2">Gerenciador de Estoque</h1>
          <p className="text-white/40 text-sm mb-10">Sistema PDS — Processo de Desenvolvimento de Software</p>

          <div
            onClick={() => { setUsername("admin"); setPassword("PDS20261") }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">admin</p>
                <p className="text-white/40 text-xs mt-0.5">Clique para preencher</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_META.admin.color}`}>
                Administrador
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 min-h-screen">
        <div className="w-full max-w-sm">

          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#030213] rounded-xl flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-500">Gerenciador de Estoque PDS</p>
          </div>

          <div className="mb-8">
            <h2 className="text-gray-900 text-xl font-medium">Bem-vindo de volta</h2>
            <p className="text-gray-500 text-sm mt-1">Faça login para acessar o sistema</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Usuário">
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError("") }}
                placeholder="seu usuário"
                className={inputCls}
              />
            </Field>

            <Field label="Senha">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError("") }}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {error && <Feedback ok={false} text={error} />}

            <button type="submit" disabled={loading} className={`${btnPrimary} mt-2`}>
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Não tem conta?{" "}
              <button onClick={onRegister} className="text-[#030213] font-medium hover:underline">
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
