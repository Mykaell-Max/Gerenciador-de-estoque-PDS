import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, Printer, X } from 'lucide-react'
import { api } from '../../services/api'
import Field from '../../components/Field'
import Feedback from '../../components/Feedback'
import ConfirmDialog from '../../components/ConfirmDialog'
import { inputCls, btnPrimary } from '../../styles/classes'
import { formatBRL } from '../../utils/format'

const TABS = [
  { key: "venda",    label: "Registrar Venda" },
  { key: "consulta", label: "Consultar Preço" },
]

const FORMA_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "credito",  label: "Cartão de Crédito" },
  { value: "debito",   label: "Cartão de Débito" },
  { value: "pix",      label: "PIX" },
]

function Comprovante({ venda, operador, onFechar }) {
  function handlePrint() { window.print() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Comprovante de Venda</h3>
          <button onClick={onFechar} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div id="comprovante-print" className="p-5 text-sm font-mono">
          <div className="text-center mb-3">
            <p className="font-bold text-base">GERENCIADOR DE ESTOQUE</p>
            <p className="text-gray-500">Comprovante de Venda</p>
          </div>
          <div className="border-t border-dashed border-gray-300 my-2" />
          <p>Venda nº: <span className="font-semibold">#{venda.id}</span></p>
          <p>Operador: <span className="font-semibold">{operador}</span></p>
          <p>Data: <span className="font-semibold">{new Date(venda.data_hora).toLocaleString('pt-BR')}</span></p>
          <div className="border-t border-dashed border-gray-300 my-2" />
          <p className="font-semibold mb-1">Itens:</p>
          {venda.itens.map((item, i) => (
            <div key={i} className="mb-1">
              <p className="truncate">{item.nome_prod}</p>
              <p className="text-gray-500 pl-2">
                {item.quantidade}x {formatBRL(item.preco_unitario)} = {formatBRL(item.subtotal)}
              </p>
            </div>
          ))}
          <div className="border-t border-dashed border-gray-300 my-2" />
          <div className="space-y-0.5">
            <div className="flex justify-between"><span>Subtotal:</span><span>{formatBRL(venda.subtotal)}</span></div>
            {venda.desconto > 0 && <div className="flex justify-between text-green-700"><span>Desconto:</span><span>- {formatBRL(venda.desconto)}</span></div>}
            <div className="flex justify-between font-bold text-base"><span>TOTAL:</span><span>{formatBRL(venda.total)}</span></div>
          </div>
          <div className="border-t border-dashed border-gray-300 my-2" />
          <p>Pagamento: <span className="font-semibold capitalize">{FORMA_PAGAMENTO.find(f => f.value === venda.forma_pagamento)?.label || venda.forma_pagamento}</span></p>
          <div className="text-center text-gray-400 mt-3 text-xs">Obrigado pela preferência!</div>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button onClick={handlePrint} className={`flex-1 ${btnPrimary}`}>
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button onClick={onFechar} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

function VendaTab({ session }) {
  const [busca, setBusca] = useState("")
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [desconto, setDesconto] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("dinheiro")
  const [feedback, setFeedback] = useState(null)
  const [finalizando, setFinalizando] = useState(false)
  const [cancelarConfirm, setCancelarConfirm] = useState(false)
  const [comprovante, setComprovante] = useState(null)
  const buscaRef = useRef(null)

  useEffect(() => {
    api("/produtos", "GET", null, session.role)
      .then(d => setProdutos(d.produtos || []))
      .catch(() => {})
  }, [])

  const q = busca.toLowerCase()
  const produtosFiltrados = produtos.filter(p =>
    q === "" || p.nome.toLowerCase().includes(q) || String(p.cod).includes(q)
  )

  const subtotal = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0)
  const descontoNum = Math.max(0, Math.min(subtotal, Number(desconto) || 0))
  const total = Math.max(0, subtotal - descontoNum)

  function adicionarItem(produto) {
    setCarrinho(prev => {
      const idx = prev.findIndex(i => i.cod === produto.cod)
      if (idx >= 0) {
        const novo = [...prev]
        if (novo[idx].quantidade < produto.qtd) {
          novo[idx] = { ...novo[idx], quantidade: novo[idx].quantidade + 1 }
        }
        return novo
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
    setBusca("")
    buscaRef.current?.focus()
  }

  function alterarQtd(cod, delta) {
    setCarrinho(prev => prev.map(i => {
      if (i.cod !== cod) return i
      const novaQtd = i.quantidade + delta
      if (novaQtd < 1) return i
      if (novaQtd > i.qtd) return i
      return { ...i, quantidade: novaQtd }
    }))
  }

  function removerItem(cod) {
    setCarrinho(prev => prev.filter(i => i.cod !== cod))
  }

  function handleCancelar() {
    setCarrinho([])
    setDesconto("")
    setFormaPagamento("dinheiro")
    setFeedback(null)
    setBusca("")
    setCancelarConfirm(false)
  }

  async function handleFinalizar() {
    if (carrinho.length === 0) { setFeedback({ text: "Adicione ao menos um item.", ok: false }); return }
    setFeedback(null)
    setFinalizando(true)
    try {
      const data = await api("/vendas", "POST", {
        itens: carrinho.map(i => ({
          cod_prod: i.cod,
          nome_prod: i.nome,
          quantidade: i.quantidade,
          preco_unitario: i.preco,
        })),
        desconto: descontoNum,
        forma_pagamento: formaPagamento,
      }, session.role, session.name)

      const vendaData = await api(`/vendas/${data.venda_id}`, "GET", null, session.role)
      setComprovante(vendaData)
      setCarrinho([])
      setDesconto("")
      setFormaPagamento("dinheiro")
    } catch (e) {
      setFeedback({ text: e.message, ok: false })
    } finally {
      setFinalizando(false)
    }
  }

  return (
    <div className="space-y-4">
      {comprovante && (
        <Comprovante
          venda={comprovante}
          operador={session.name}
          onFechar={() => setComprovante(null)}
        />
      )}

      {cancelarConfirm && (
        <ConfirmDialog
          title="Cancelar venda"
          message="Deseja cancelar a venda atual? O carrinho será esvaziado e nenhuma movimentação será registrada."
          confirmLabel="Cancelar venda"
          onConfirm={handleCancelar}
          onCancel={() => setCancelarConfirm(false)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="text-gray-800 font-medium mb-3">Adicionar Produto</h3>
        <div className="flex gap-2 mb-3">
          <input
            ref={buscaRef}
            value={busca}
            onChange={e => setBusca(e.target.value)}
            type="text"
            placeholder="Filtrar por nome ou código"
            className={`${inputCls} flex-1`}
          />
          {busca && (
            <button type="button" onClick={() => setBusca("")} className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all text-sm">
              Limpar
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-52 overflow-y-auto">
          {produtosFiltrados.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">Nenhum produto encontrado.</p>
          ) : (
            produtosFiltrados.map(p => (
              <div key={p.cod} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.nome}</p>
                  <p className="text-xs text-gray-500">Cód: {p.cod} · Estoque: {p.qtd}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0 mr-3">{formatBRL(p.preco)}</p>
                <button
                  onClick={() => adicionarItem(p)}
                  title={`Adicionar ${p.nome} ao carrinho`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#030213] text-white text-xs font-medium hover:bg-[#030213]/85 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-gray-800 font-medium flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Carrinho ({carrinho.length} {carrinho.length === 1 ? "item" : "itens"})
          </h3>
          {carrinho.length > 0 && (
            <button
              onClick={() => setCancelarConfirm(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Cancelar venda
            </button>
          )}
        </div>

        {carrinho.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Nenhum item adicionado.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {carrinho.map(item => (
              <div key={item.cod} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.nome}</p>
                  <p className="text-xs text-gray-500">{formatBRL(item.preco)} / un</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => alterarQtd(item.cod, -1)}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                  <button
                    onClick={() => alterarQtd(item.cod, +1)}
                    disabled={item.quantidade >= item.qtd}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900 w-20 text-right">
                  {formatBRL(item.preco * item.quantidade)}
                </p>
                <button
                  onClick={() => removerItem(item.cod)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {carrinho.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 shrink-0">Desconto (R$)</span>
              <input
                value={desconto}
                onChange={e => setDesconto(e.target.value)}
                type="text"
                placeholder="0,00"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#030213]/20"
              />
              <span className="text-green-700 w-20 text-right shrink-0">- {formatBRL(descontoNum)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
          </div>

          <Field label="Forma de Pagamento">
            <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} className={inputCls}>
              {FORMA_PAGAMENTO.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </Field>

          {feedback && <Feedback ok={feedback.ok} text={feedback.text} />}

          <button onClick={handleFinalizar} disabled={finalizando} className={btnPrimary}>
            {finalizando ? "Finalizando..." : `Finalizar Venda — ${formatBRL(total)}`}
          </button>
        </div>
      )}
    </div>
  )
}

function ConsultaTab({ session }) {
  const [busca, setBusca] = useState("")
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api("/produtos", "GET", null, session.role)
      .then(d => setProdutos(d.produtos || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const q = busca.toLowerCase()
  const produtosFiltrados = produtos.filter(p =>
    q === "" || p.nome.toLowerCase().includes(q) || String(p.cod).includes(q)
  )

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="text-gray-800 font-medium mb-3">Consultar Preço</h3>
        <div className="flex gap-2">
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            type="text"
            placeholder="Filtrar por nome ou código"
            className={`${inputCls} flex-1`}
          />
          {busca && (
            <button type="button" onClick={() => setBusca("")} className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all text-sm">
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
        ) : (
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  {["Código", "Nome", "Descrição", "Preço", "Estoque"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {produtosFiltrados.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum produto encontrado.</td></tr>
                ) : (
                  produtosFiltrados.map(p => (
                    <tr key={p.cod} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">{p.cod}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{p.desc}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold whitespace-nowrap">{formatBRL(p.preco)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          p.qtd > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                          {p.qtd > 0 ? `${p.qtd} un.` : "Sem estoque"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CashierScreen({ session }) {
  const [activeTab, setActiveTab] = useState("venda")

  return (
    <div>
      <h2 className="text-gray-900 text-xl font-medium mb-4">Caixa</h2>

      <div className="flex gap-2 mb-6">
        {TABS.map(tab => (
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

      {activeTab === "venda"    && <VendaTab session={session} />}
      {activeTab === "consulta" && <ConsultaTab session={session} />}
    </div>
  )
}
