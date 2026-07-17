import { X, Lock, ShoppingCart } from 'lucide-react'
import { ROLE_META } from '../../constants/roles'
import { menuItems } from '../../services/rbac'

export default function MobileDrawer({ session, activeTab, onNavigate, onClose }) {
  const meta = ROLE_META[session.role]
  const items = menuItems(session.role)

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-4 py-4 bg-[#030213]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Menu</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{session.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium mt-1 inline-block ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                disabled={!item.allowed}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                  !item.allowed
                    ? "text-gray-300 cursor-not-allowed"
                    : activeTab === item.key
                    ? "bg-[#030213] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {!item.allowed && <Lock className="w-3 h-3" />}
              </button>
            )
          })}
        </nav>

      </aside>
    </div>
  )
}
