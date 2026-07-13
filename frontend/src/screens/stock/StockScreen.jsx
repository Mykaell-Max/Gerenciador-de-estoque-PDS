import { useState, useEffect } from 'react'
import { Pencil, ArrowLeft } from 'lucide-react'
import { api } from '../../services/api'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import { inputCls, btnPrimary } from '../../styles/classes'

const TABS = [
  { key: "register", label: "Cadastrar" },
  { key: "manage",   label: "Gerenciar" },
]

function validarCadastro({ code, name, description, batch, qty }) {
  if (!code.trim()) return "Código não pode estar vazio."
  if (String(code.trim()).length < 5) return "Código deve ter no mínimo 5 dígitos."
  if (isNaN(Number(code))) return "Código deve ser um número."
  if (!name.trim()) return "Nome não pode estar vazio."
  if (name.trim().length < 3) return "Nome deve ter no mínimo 3 caracteres."
  if (!description.trim()) return "Descrição não pode estar vazia."
  if (!batch.trim()) return "Lote não pode estar vazio."
  if (isNaN(Number(batch)) || Number(batch) < 0) return "Lote inválido."
  if (String(batch.trim()).length < 6) return "Lote deve ter no mínimo 6 dígitos."
  if (!qty.trim()) return "Quantidade não pode estar vazia."
  if (isNaN(Number(qty)) || Number(qty) < 0) return "Quantidade não pode ser negativa."
  return null
}

function validarEdicao({ name, description, batch, qty }) {
  if (!name.trim()) return "Nome não pode estar vazio."
  if (name.trim().length < 3) return "Nome deve ter no mínimo 3 caracteres."
  if (!description.trim()) return "Descrição não pode estar vazia."
  if (!String(batch).trim()) return "Lote não pode estar vazio."
  if (isNaN(Number(batch)) || Number(batch) < 0) return "Lote inválido."
  if (String(batch).trim().length < 6) return "Lote deve ter no mínimo 6 dígitos."
  if (String(qty).trim() === "") return "Quantidade não pode estar vazia."
  if (isNaN(Number(qty)) || Number(qty) < 0) return "Quantidade não pode ser negativa."
  return null
}

function RegisterTab({ session }) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [batch, setBatch] = useState("")
  const [qty, setQty] = useState("")
  const [feedback, setFeedback] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)

    const erro = validarCadastro({ code, name, description, batch, qty })
    if (erro) { setFeedback({ text: erro, ok: false }); return }

    try {
      const data = await api("/cadastrarProduto", "POST", {
        cod: Number(code),
        nome: name,
        desc: description,
        lote: Number(batch),
        qtd: Number(qty),
      }, session.role, session.name)
      setFeedback({ text: data.message, ok: true })
      setCode(""); setName(""); setDescription(""); setBatch(""); setQty("")
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 max-w-md w-full">
      <h3 className="text-gray-800 font-medium mb-4">Cadastrar Produto</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Código">
          <input value={code} onChange={e => setCode(e.target.value)} type="text" placeholder="Ex: 10001" className={inputCls} />
        </Field>
        <Field label="Nome">
          <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Nome do produto" className={inputCls} />
        </Field>
        <Field label="Descrição">
          <input value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="Descrição do produto" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lote">
            <input value={batch} onChange={e => setBatch(e.target.value)} type="text" placeholder="Ex: 202601" className={inputCls} />
          </Field>
          <Field label="Qtd. Inicial">
            <input value={qty} onChange={e => setQty(e.target.value)} type="text" placeholder="0" className={inputCls} />
          </Field>
        </div>
        {feedback && <Feedback ok={feedback.ok} text={feedback.text} />}
        <button type="submit" className={btnPrimary}>Cadastrar Produto</button>
      </form>
    </div>
  )
}

function EditForm({ product, session, onCancel, onSuccess }) {
  const [name, setName] = useState(product.nome)
  const [description, setDescription] = useState(product.desc)
  const [batch, setBatch] = useState(String(product.lote))
  const [qty, setQty] = useState(String(product.qtd))
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)

    const erro = validarEdicao({ name, description, batch, qty })
    if (erro) { setFeedback({ text: erro, ok: false }); return }

    setLoading(true)
    try {
      const data = await api(`/produtos/${product.cod}`, "PUT", {
        nome: name,
        desc: description,
        lote: Number(batch),
        qtd: Number(qty),
      }, session.role, session.name)
      setFeedback({ text: data.message, ok: true })
      setTimeout(onSuccess, 1200)
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-gray-800 font-medium">Editar Produto</h3>
      </div>

      <div className="mb-4 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500">
        Código: <span className="font-semibold text-gray-900">{product.cod}</span>
        <span className="mx-2 text-gray-300">|</span>
        O código do produto não pode ser alterado.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome">
          <input value={name} onChange={e => setName(e.target.value)} type="text" className={inputCls} />
        </Field>
        <Field label="Descrição">
          <input value={description} onChange={e => setDescription(e.target.value)} type="text" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lote">
            <input value={batch} onChange={e => setBatch(e.target.value)} type="text" className={inputCls} />
          </Field>
          <Field label="Quantidade">
            <input value={qty} onChange={e => setQty(e.target.value)} type="text" className={inputCls} />
          </Field>
        </div>
        {feedback && <Feedback ok={feedback.ok} text={feedback.text} />}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className={`flex-1 ${btnPrimary}`}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  )
}


function ManageTab({ session }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    api("/produtos", "GET", null, session.role)
      .then(data => setProducts(data.produtos || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await api("/produtos", "GET", null, session.role)
      setProducts(data.produtos || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(cod) {
    try {
      const produto = await api(`/produtos/${cod}`, "GET", null, session.role)
      setEditing(produto)
    } catch (e) {
      alert(e.message)
    }
  }

  if (editing) {
    return (
      <EditForm
        product={editing}
        session={session}
        onCancel={() => setEditing(null)}
        onSuccess={() => { setEditing(null); loadProducts() }}
      />
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">Nenhum produto cadastrado.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Código", "Nome", "Descrição", "Lote", "Qtd.", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.cod} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">{p.cod}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{p.nome}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{p.desc}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.lote}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.qtd}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(p.cod)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


export default function StockScreen({ session }) {
  const [activeTab, setActiveTab] = useState("register")

  return (
    <div>
      <h2 className="text-gray-900 text-xl font-medium mb-4">Estoque</h2>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {activeTab === "register" && <RegisterTab session={session} />}
      {activeTab === "manage"   && <ManageTab session={session} />}
    </div>
  )
}
