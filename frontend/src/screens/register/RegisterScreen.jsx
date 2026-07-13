import { useState } from 'react'
import { ShoppingCart, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { api } from '../../services/api'
import { ROLE_META } from '../../constants/roles'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import { inputCls, btnPrimary } from '../../styles/classes'

const availableRoles = [
  { role: "estoque", desc: "Adicionar e gerenciar produtos no estoque." },
  { role: "caixa",   desc: "Operações de venda e saída de produtos." },
]

export default function RegisterScreen({ onBack, onSuccess }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("estoque")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setFeedback(null)

    if (password !== confirmPassword) {
      setFeedback({ ok: false, text: "As senhas não coincidem." })
      return
    }

    setLoading(true)
    try {
      const data = await api("/registrar", "POST", { usuario: username, email, senha: password, tipo: role })
      setFeedback({ ok: true, text: data.message })
      setTimeout(onSuccess, 1500)
    } catch (e) {
      setFeedback({ ok: false, text: e.message })
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
          <h1 className="text-white text-2xl font-medium mb-2">Crie sua conta</h1>
          <p className="text-white/40 text-sm mb-10">Escolha seu perfil de acesso ao sistema</p>

          <div className="space-y-3 text-left">
            {availableRoles.map(({ role: r, desc }) => (
              <div
                key={r}
                onClick={() => setRole(r)}
                className={`border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  role === r
                    ? "bg-white/15 border-white/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_META[r].color}`}>
                    {ROLE_META[r].label}
                  </span>
                  {role === r && <ChevronRight className="w-4 h-4 text-white/60" />}
                </div>
                <p className="text-white/50 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-xs mt-4">Clique para selecionar seu perfil</p>
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
            <h2 className="text-gray-900 text-xl font-medium">Criar conta</h2>
            <p className="text-gray-500 text-sm mt-1">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Usuário">
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="seu usuário" className={inputCls} />
            </Field>

            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" className={inputCls} />
            </Field>

            <Field label="Senha">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="mínimo 8 caracteres"
                  className={`${inputCls} pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Field label="Confirmar senha">
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="repita a senha" className={inputCls} />
            </Field>

            <div className="lg:hidden">
              <Field label="Perfil">
                <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                  {availableRoles.map(({ role: r }) => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Perfil selecionado:</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${ROLE_META[role].color}`}>
                {ROLE_META[role].label}
              </span>
            </div>

            {feedback && <Feedback ok={feedback.ok} text={feedback.text} />}

            <button type="submit" disabled={loading || feedback?.ok} className={`${btnPrimary} mt-2`}>
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem conta?{" "}
              <button onClick={onBack} className="text-[#030213] font-medium hover:underline">
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
