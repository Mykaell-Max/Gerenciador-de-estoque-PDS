import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Lock, Package, TrendingUp, ShoppingBag, AlertTriangle } from 'lucide-react'
import { ROLE_META } from '../../constants/roles'
import { canAccess } from '../../services/rbac'
import { api } from '../../services/api'
import { formatBRL } from '../../utils/format'

const CARDS = [
  { key: "estoque",  title: "Estoque",  desc: "Cadastrar e consultar produtos.",   roles: ["admin", "estoque"] },
  { key: "caixa",    title: "Caixa",    desc: "Operações de venda e saída.",        roles: ["admin", "caixa"] },
  { key: "usuarios", title: "Usuários", desc: "Cadastrar e gerenciar permissões.",  roles: ["admin"] },
]

function formatDia(str) {
  const [, m, d] = str.split('-')
  return `${d}/${m}`
}

function TooltipBRL({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('fat')
            ? formatBRL(p.value)
            : p.value}
        </p>
      ))}
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, color = "text-[#030213]" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start gap-3">
      <div className="p-2.5 rounded-xl bg-gray-100 shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 ${className}`}>
      <p className="text-sm font-medium text-gray-800 mb-4">{title}</p>
      {children}
    </div>
  )
}

export default function DashboardScreen({ session, onNavigate }) {
  const meta = ROLE_META[session.role]
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAdmin   = session.role === 'admin'
  const isCaixa   = session.role === 'caixa'
  const isEstoque = session.role === 'estoque'
  const verVendas = isAdmin || isCaixa
  const verEstoque = isAdmin || isEstoque

  useEffect(() => {
    api("/dashboard", "GET", null, session.role)
      .then(setDados)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">

      {/* Saudação */}
      <div>
        <h2 className="text-gray-900 text-xl font-medium">Olá, {session.name}!</h2>
        <p className="text-gray-500 text-sm mt-1">
          Logado como <strong>{meta.label}</strong>. Acesse os módulos disponíveis para o seu perfil.
        </p>
      </div>

      {/* Cards de atalho */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {CARDS.map((card) => {
          const allowed = canAccess(session.role, card.key)
          return (
            <div
              key={card.key}
              onClick={() => allowed && onNavigate(card.key)}
              className={`rounded-2xl border p-4 transition-all ${
                allowed
                  ? "bg-white border-gray-200 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]"
                  : "bg-gray-50 border-dashed border-gray-200 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className={`text-sm font-medium ${allowed ? "text-gray-900" : "text-gray-400"}`}>
                  {card.title}
                </p>
                {!allowed && <Lock className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />}
              </div>
              <p className={`text-xs ${allowed ? "text-gray-500" : "text-gray-300"}`}>
                {card.desc}
              </p>
              {allowed && (
                <span className="inline-block mt-3 text-xs text-[#030213] bg-gray-100 px-2 py-0.5 rounded-full">
                  Acessar →
                </span>
              )}
            </div>
          )
        })}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-8">Carregando dados...</div>
      ) : dados && (
        <>
          <div className={`grid gap-4 ${
            verVendas && verEstoque
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3"
          }`}>
            {verEstoque && (
              <>
                <KpiCard
                  icon={Package}
                  label="Produtos cadastrados"
                  value={dados.total_produtos}
                  sub={`${dados.sem_estoque} sem estoque`}
                  color={dados.sem_estoque > 0 ? "text-orange-500" : "text-[#030213]"}
                />
                <KpiCard
                  icon={Package}
                  label="Itens em estoque"
                  value={dados.total_estoque.toLocaleString('pt-BR')}
                  sub={`Valor: ${formatBRL(dados.valor_estoque)}`}
                />
              </>
            )}
            {verVendas && (
              <>
                <KpiCard
                  icon={ShoppingBag}
                  label="Vendas hoje"
                  value={dados.vendas_hoje}
                  sub={formatBRL(dados.faturamento_hoje)}
                  color="text-green-600"
                />
                <KpiCard
                  icon={TrendingUp}
                  label="Faturamento total"
                  value={formatBRL(dados.faturamento_total)}
                  sub={`${dados.total_vendas} vendas`}
                  color="text-blue-600"
                />
              </>
            )}
          </div>

          {verEstoque && dados.baixo_estoque.some(p => p.qtd === 0) && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 text-sm text-orange-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {dados.baixo_estoque.filter(p => p.qtd === 0).length} produto(s) sem estoque.
                {' '}
                <button onClick={() => onNavigate('estoque')} className="underline font-medium">
                  Ver estoque →
                </button>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {verEstoque && (
              <ChartCard title="Movimentações — últimos 7 dias (unidades)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dados.movimentacoes_por_dia} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="data" tickFormatter={formatDia} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<TooltipBRL />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="entradas" name="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saidas"   name="Saídas"   fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {verVendas && (
              <ChartCard title="Faturamento — últimos 7 dias (R$)">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dados.vendas_por_dia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="data" tickFormatter={formatDia} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} />
                    <Tooltip content={<TooltipBRL />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      dataKey="faturamento"
                      name="Faturamento"
                      stroke="#030213"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#030213" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {verVendas && (
              <ChartCard title="Número de vendas — últimos 7 dias">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dados.vendas_por_dia} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="data" tickFormatter={formatDia} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<TooltipBRL />} />
                    <Bar dataKey="vendas" name="Vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {verEstoque && (
              <ChartCard title="Produtos com menor estoque">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={dados.baixo_estoque}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis
                      dataKey="nome"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={110}
                      tickFormatter={v => v.length > 14 ? v.slice(0, 14) + '…' : v}
                    />
                    <Tooltip content={<TooltipBRL />} />
                    <Bar
                      dataKey="qtd"
                      name="Qtd. estoque"
                      radius={[0, 4, 4, 0]}
                      fill="#f97316"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {verEstoque && (
              <ChartCard title="Mais movimentados — últimos 30 dias">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={dados.mais_movimentados}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis
                      dataKey="nome"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={110}
                      tickFormatter={v => v.length > 14 ? v.slice(0, 14) + '…' : v}
                    />
                    <Tooltip content={<TooltipBRL />} />
                    <Bar
                      dataKey="movimentacoes"
                      name="Movimentações"
                      radius={[0, 4, 4, 0]}
                      fill="#8b5cf6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>
        </>
      )}
    </div>
  )
}
