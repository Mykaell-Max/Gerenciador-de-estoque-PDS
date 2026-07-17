import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { ROLE_META } from '../../constants/roles'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import ConfirmDialog from '../../components/ConfirmDialog'
import { inputCls, btnPrimary } from '../../styles/classes'
import { Lock, Unlock } from 'lucide-react'

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

  // SCRUM-9: block modal state
  const [blockTarget, setBlockTarget] = useState(null)
  const [blockMotivo, setBlockMotivo] = useState("")
  const [blockData, setBlockData] = useState("")
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockFeedback, setBlockFeedback] = useState(null)
  const [unblockTarget, setUnblockTarget] = useState(null)
  const [unblockLoading, setUnblockLoading] = useState(false)
  const [manageFeedback, setManageFeedback] = useState(null)

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

  // SCRUM-9: block handler
  async function handleConfirmBlock() {
    if (!blockTarget) return
    if (!blockMotivo.trim()) { setBlockFeedback("Informe o motivo do bloqueio."); return }
    setBlockLoading(true)
    setBlockFeedback(null)
    try {
      await api(`/usuarios/${blockTarget.id}/bloquear`, "PUT", {
        motivo: blockMotivo,
        data_desbloqueio: blockData || null,
      }, session.role, session.name)
      setBlockTarget(null); setBlockMotivo(""); setBlockData("")
      setManageFeedback({ text: `Usuário '${blockTarget.nome}' bloqueado.`, ok: true })
      loadUsers()
    } catch (e) {
      setBlockFeedback(e.message)
    } finally {
      setBlockLoading(false)
    }
  }

  async function handleConfirmUnblock() {
    if (!unblockTarget) return
    setUnblockLoading(true)
    try {
      await api(`/usuarios/${unblockTarget.id}/desbloquear`, "PUT", null, session.role, session.name)
      setManageFeedback({ text: `Usuário '${unblockTarget.nome}' desbloqueado.`, ok: true })
      setUnblockTarget(null)
      loadUsers()
    } catch (e) {
      setManageFeedback({ text: e.message, ok: false })
    } finally {
      setUnblockLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-gray-900 text-xl font-medium mb-4">Usuários</h2>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setRegisterFeedback(null); setManageFeedback(null) }}
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
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6  w-full">
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
        <div>
          {manageFeedback && <div className="mb-4"><Feedback ok={manageFeedback.ok} text={manageFeedback.text} /></div>}

          {blockTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-gray-900 font-medium mb-4">Bloquear usuário: {blockTarget.nome}</h3>
                <div className="space-y-3">
                  <Field label="Motivo do bloqueio">
                    <input
                      value={blockMotivo}
                      onChange={e => setBlockMotivo(e.target.value)}
                      type="text"
                      placeholder="Informe o motivo"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Data de desbloqueio (opcional)">
                    <input
                      value={blockData}
                      onChange={e => setBlockData(e.target.value)}
                      type="date"
                      className={inputCls}
                    />
                  </Field>
                  {blockFeedback && <Feedback ok={false} text={blockFeedback} />}
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => { setBlockTarget(null); setBlockMotivo(""); setBlockData(""); setBlockFeedback(null) }}
                    disabled={blockLoading}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBlock}
                    disabled={blockLoading}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all disabled:opacity-60"
                  >
                    {blockLoading ? "Bloqueando..." : "Bloquear"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {unblockTarget && (
            <ConfirmDialog
              title="Desbloquear usuário"
              message={`Deseja desbloquear o usuário '${unblockTarget.nome}'?`}
              confirmLabel="Desbloquear"
              onConfirm={handleConfirmUnblock}
              onCancel={() => setUnblockTarget(null)}
              loading={unblockLoading}
            />
          )}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {loadingUsers ? (
              <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Usuário", "Email", "Perfil atual", "Status", "Alterar perfil", "Ações"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className={`hover:bg-gray-50 ${u.bloqueado ? "bg-red-50/40" : ""}`}>
                        <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{u.nome}</td>
                        <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{u.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_META[u.tipo]?.color}`}>
                            {ROLE_META[u.tipo]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.bloqueado ? (
                            <span className="text-xs px-2 py-0.5 rounded-full border bg-red-100 text-red-700 border-red-200">
                              Bloqueado
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">
                              Ativo
                            </span>
                          )}
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
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {u.bloqueado ? (
                              <button
                                onClick={() => setUnblockTarget(u)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <Unlock className="w-3 h-3" />
                                Desbloquear
                              </button>
                            ) : (
                              <button
                                onClick={() => { setBlockTarget(u); setBlockFeedback(null) }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
                              >
                                <Lock className="w-3 h-3" />
                                Bloquear
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
