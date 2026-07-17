import { useState, useEffect } from 'react'
import { Pencil, ArrowLeft, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { api } from '../../services/api'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import ConfirmDialog from '../../components/ConfirmDialog'
import { inputCls, btnPrimary } from '../../styles/classes'

const TABS = [
  { key: "register", label: "Cadastrar" },
  { key: "manage",   label: "Gerenciar" },
  { key: "movement", label: "Movimentação" },
  { key: "history",  label: "Histórico" },
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

function centavosParaDisplay(centavos) {
  return (centavos / 100).toFixed(2).replace('.', ',')
}

function inputParaCentavos(raw) {
  const digits = raw.replace(/\D/g, '')
  return parseInt(digits || '0', 10)
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
  const [precoCentavos, setPrecoCentavos] = useState(0)
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
        preco: precoCentavos / 100,
      }, session.role, session.name)
      setFeedback({ text: data.message, ok: true })
      setCode(""); setName(""); setDescription(""); setBatch(""); setQty(""); setPrecoCentavos(0)
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6  w-full">
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
        <Field label="Preço (R$)">
          <input
            value={centavosParaDisplay(precoCentavos)}
            onChange={e => setPrecoCentavos(inputParaCentavos(e.target.value))}
            type="text"
            inputMode="numeric"
            placeholder="0,00"
            className={inputCls}
          />
        </Field>
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
  const [precoCentavos, setPrecoCentavos] = useState(Math.round((product.preco ?? 0) * 100))
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
        preco: precoCentavos / 100,
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
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6  w-full">
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
        <Field label="Preço (R$)">
          <input
            value={centavosParaDisplay(precoCentavos)}
            onChange={e => setPrecoCentavos(inputParaCentavos(e.target.value))}
            type="text"
            inputMode="numeric"
            className={inputCls}
          />
        </Field>
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
  const [removing, setRemoving] = useState(null)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

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

  async function handleConfirmRemove() {
    if (!removing) return
    setRemoveLoading(true)
    try {
      await api(`/produtos/${removing.cod}`, "DELETE", null, session.role, session.name)
      setRemoving(null)
      setFeedback({ text: `Produto '${removing.nome}' removido com sucesso!`, ok: true })
      loadProducts()
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
      setRemoving(null)
    } finally {
      setRemoveLoading(false)
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
    <div>
      {feedback && <div className="mb-4"><Feedback ok={feedback.ok} text={feedback.text} /></div>}
      {removing && (
        <ConfirmDialog
          title="Remover produto"
          message={`Tem certeza que deseja remover o produto '${removing.nome}' (cód: ${removing.cod})? Esta ação não pode ser desfeita.`}
          confirmLabel="Remover"
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemoving(null)}
          loading={removeLoading}
        />
      )}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p.cod)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => setRemoving(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
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
  )
}


function MovementTab({ session }) {
  const [products, setProducts] = useState([])
  const [cod, setCod] = useState("")
  const [tipo, setTipo] = useState("entrada")
  const [qty, setQty] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api("/produtos", "GET", null, session.role)
      .then(d => setProducts(d.produtos || []))
      .catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)

    if (!cod) { setFeedback({ text: "Selecione um produto.", ok: false }); return }
    if (!qty.trim() || isNaN(Number(qty)) || Number(qty) <= 0) {
      setFeedback({ text: "Quantidade deve ser maior que zero.", ok: false })
      return
    }

    setSubmitting(true)
    try {
      const data = await api("/movimentacoes", "POST", {
        cod: Number(cod),
        tipo,
        qtd: Number(qty),
      }, session.role, session.name)
      setFeedback({ text: data.message, ok: true })
      setQty("")
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 w-full">
      <h3 className="text-gray-800 font-medium mb-4">Registrar Movimentação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Produto">
          <select value={cod} onChange={e => setCod(e.target.value)} className={inputCls}>
            <option value="">Selecione um produto</option>
            {products.map(p => (
              <option key={p.cod} value={p.cod}>{p.cod} - {p.nome} (qtd: {p.qtd})</option>
            ))}
          </select>
        </Field>
        <Field label="Tipo de Movimentação">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("entrada")}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                tipo === "entrada" ? "bg-green-50 border-green-300 text-green-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipo("saida")}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                tipo === "saida" ? "bg-red-50 border-red-300 text-red-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Saída
            </button>
          </div>
        </Field>
        <Field label="Quantidade">
          <input value={qty} onChange={e => setQty(e.target.value)} type="text" placeholder="0" className={inputCls} />
        </Field>
        {feedback && <Feedback ok={feedback.ok} text={feedback.text} />}
        <button type="submit" disabled={submitting} className={btnPrimary}>
          {submitting ? "Registrando..." : "Registrar Movimentação"}
        </button>
      </form>
    </div>
  )
}


function HistoryTab({ session }) {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtCod, setFiltCod] = useState("")
  const [filtUsuario, setFiltUsuario] = useState("")
  const [filtTipo, setFiltTipo] = useState("")
  const [filtDataInicio, setFiltDataInicio] = useState("")
  const [filtDataFim, setFiltDataFim] = useState("")
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const POR_PAGINA = 20

  useEffect(() => {
    loadMovements()
  }, [pagina])

  async function loadMovements() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pagina, por_pagina: POR_PAGINA })
      if (filtCod) params.set("cod_prod", filtCod)
      if (filtUsuario) params.set("usuario", filtUsuario)
      if (filtTipo) params.set("tipo", filtTipo)
      if (filtDataInicio) params.set("data_inicio", filtDataInicio)
      if (filtDataFim) params.set("data_fim", filtDataFim)
      const data = await api(`/movimentacoes?${params}`, "GET", null, session.role)
      setMovements(data.movimentacoes || [])
      setTotal(data.total || 0)
    } catch {
      setMovements([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  function handleFiltrar(e) {
    e.preventDefault()
    setPagina(1)
    loadMovements()
  }

  function handleLimpar() {
    setFiltCod(""); setFiltUsuario(""); setFiltTipo("")
    setFiltDataInicio(""); setFiltDataFim(""); setPagina(1)
  }

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  return (
    <div className="space-y-4">
      <form onSubmit={handleFiltrar} className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Produto (código)">
            <input value={filtCod} onChange={e => setFiltCod(e.target.value)} type="text" placeholder="Todos" className={inputCls} />
          </Field>
          <Field label="Usuário">
            <input value={filtUsuario} onChange={e => setFiltUsuario(e.target.value)} type="text" placeholder="Todos" className={inputCls} />
          </Field>
          <Field label="Tipo">
            <select value={filtTipo} onChange={e => setFiltTipo(e.target.value)} className={inputCls}>
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </Field>
          <Field label="Data início">
            <input value={filtDataInicio} onChange={e => setFiltDataInicio(e.target.value)} type="date" className={inputCls} />
          </Field>
          <Field label="Data fim">
            <input value={filtDataFim} onChange={e => setFiltDataFim(e.target.value)} type="date" className={inputCls} />
          </Field>
          <div className="flex items-end gap-2">
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#030213] text-white text-sm font-medium hover:bg-[#030213]/90 transition-all">
              Filtrar
            </button>
            <button type="button" onClick={handleLimpar} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all">
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
        ) : movements.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Nenhuma movimentação encontrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Data/Hora", "Produto", "Tipo", "Qtd.", "Est. Anterior", "Est. Posterior", "Usuário"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(m.data_hora).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{m.cod} - {m.nome}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        m.tipo === "entrada" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        {m.tipo === "entrada" ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                        {m.tipo === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.qtd}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.estoque_anterior ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.estoque_posterior ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{total} registros</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5">{pagina} / {totalPaginas}</span>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Próxima
            </button>
          </div>
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
      {activeTab === "movement" && <MovementTab session={session} />}
      {activeTab === "history"  && <HistoryTab session={session} />}
    </div>
  )
}
