import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { ROLE_META } from '../../constants/roles'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import { inputCls, btnPrimary } from '../../styles/classes'

const TABS = [
  { key: "register", label: "Cadastrar" },
  { key: "manage",   label: "Gerenciar" },
]

export default function UsersScreen({ session }) {
  const [activeTab, setActiveTab] = useState("register")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("estoque")
  const [registerFeedback, setRegisterFeedback] = useState(null)

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    if (activeTab === "manage") loadUsers().then()
  }, [activeTab])

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const data = await api("/cadastrar", "POST", { usuario: username, email, senha: password, tipo: role }, session.role, session.name)
      setRegisterFeedback({ text: data.message, ok: true })
      setUsername(""); setEmail(""); setPassword(""); setRole("estoque")
    } catch (e) {
      setRegisterFeedback({ text: e.message, ok: false })
    }
  }

  async function loadUsers() {
    setLoadingUsers(true)
    const data = await api("/usuarios", "GET", null, session.role)
    setUsers(data.usuarios || [])
    setLoadingUsers(false)
  }

  async function updateRole(id, newRole) {
    await api(`/usuarios/${id}/role`, "PUT", { tipo: newRole }, session.role, session.name)
    loadUsers()
  }

  return (
    <div>
      <h2 className="text-gray-900 text-xl font-medium mb-4">Usuários</h2>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setRegisterFeedback(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#030213] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "register" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 max-w-md w-full">
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Usuário">
              <input value={username} onChange={e => setUsername(e.target.value)} type="text" className={inputCls} />
            </Field>
            <Field label="Email">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className={inputCls} />
            </Field>
            <Field label="Senha">
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className={inputCls} />
            </Field>
            <Field label="Perfil">
              <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                <option value="admin">Administrador</option>
                <option value="estoque">Estoque</option>
                <option value="caixa">Caixa</option>
              </select>
            </Field>
            {registerFeedback && <Feedback ok={registerFeedback.ok} text={registerFeedback.text} />}
            <button type="submit" className={btnPrimary}>Cadastrar Usuário</button>
          </form>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loadingUsers ? (
            <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Usuário", "Email", "Perfil atual", "Alterar perfil"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{u.nome}</td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{u.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_META[u.tipo]?.color}`}>
                          {ROLE_META[u.tipo]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.tipo}
                          onChange={e => updateRole(u.id, e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#030213]/20"
                        >
                          <option value="admin">Administrador</option>
                          <option value="estoque">Estoque</option>
                          <option value="caixa">Caixa</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
