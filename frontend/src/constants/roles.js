import { LayoutDashboard, Package, ShoppingBag, Users, ScrollText } from 'lucide-react'

export const ROLE_META = {
  admin:   { label: "Administrador", color: "bg-purple-100 text-purple-700 border-purple-200" },
  estoque: { label: "Estoque",       color: "bg-blue-100 text-blue-700 border-blue-200" },
  caixa:   { label: "Caixa",         color: "bg-green-100 text-green-700 border-green-200" },
}

export const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "estoque", "caixa"] },
  { key: "estoque",   label: "Estoque",   icon: Package,         roles: ["admin", "estoque"] },
  { key: "caixa",     label: "Caixa",     icon: ShoppingBag,     roles: ["admin", "caixa"] },
  { key: "usuarios",  label: "Usuários",  icon: Users,           roles: ["admin"] },
  { key: "logs",      label: "Logs",      icon: ScrollText,      roles: ["admin"] },
]
