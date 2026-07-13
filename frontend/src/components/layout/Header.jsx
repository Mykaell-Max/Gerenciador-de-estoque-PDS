import { ShoppingCart, Menu } from 'lucide-react'
import { ROLE_META } from '../../constants/roles'

export default function Header({ session, onLogout, onMenuOpen }) {
  const meta = ROLE_META[session.role]

  return (
    <header className="bg-[#030213] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-1 -ml-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <ShoppingCart className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium hidden sm:block truncate">Gerenciador de Estoque PDS</span>
        <span className="text-sm font-medium sm:hidden">Estoque PDS</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        <span className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${meta.color}`}>
          {meta.label}
        </span>
        <span className={`sm:hidden text-xs px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
          {session.role === "admin" ? "ADM" : session.role === "estoque" ? "EST" : "CX"}
        </span>
        <span className="text-white/70 text-sm hidden md:block max-w-[120px] truncate">
          {session.name}
        </span>
        <button
          onClick={onLogout}
          className="text-xs text-white/60 hover:text-white border border-white/20 rounded-lg px-2.5 sm:px-3 py-1 transition-colors whitespace-nowrap"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
