import { Lock } from 'lucide-react'
import { menuItems } from '../../services/rbac'

export default function Sidebar({ role, activeTab, onNavigate }) {
  const items = menuItems(role)

  return (
    <aside className="w-52 bg-white border-r border-gray-100 p-4 hidden md:block shrink-0">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              disabled={!item.allowed}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                !item.allowed
                  ? "text-gray-300 cursor-not-allowed"
                  : activeTab === item.key
                  ? "bg-[#030213] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
              {!item.allowed && <Lock className="w-3 h-3" />}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
