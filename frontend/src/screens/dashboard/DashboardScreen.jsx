import { Lock } from 'lucide-react'
import { ROLE_META } from '../../constants/roles'
import { canAccess } from '../../services/rbac'

const CARDS = [
  { key: "estoque",  title: "Estoque",  desc: "Cadastrar e consultar produtos.",   roles: ["admin", "estoque"] },
  { key: "caixa",    title: "Caixa",    desc: "Operações de venda e saída.",        roles: ["admin", "caixa"] },
  { key: "usuarios", title: "Usuários", desc: "Cadastrar e gerenciar permissões.",  roles: ["admin"] },
]

export default function DashboardScreen({ session, onNavigate }) {
  const meta = ROLE_META[session.role]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 text-xl font-medium">Olá, {session.name}!</h2>
        <p className="text-gray-500 text-sm mt-1">
          Logado como <strong>{meta.label}</strong>. Acesse os módulos disponíveis para o seu perfil.
        </p>
      </div>

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
    </div>
  )
}
