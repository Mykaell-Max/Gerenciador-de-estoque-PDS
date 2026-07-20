import { useState } from 'react'
import { canAccess, initialScreen } from '../../services/rbac'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import MobileDrawer from '../../components/layout/MobileDrawer'
import DashboardScreen from './DashboardScreen'
import StockScreen from '../stock/StockScreen'
import CashierScreen from '../cashier/CashierScreen'
import UsersScreen from '../users/UsersScreen'
import LogsScreen from '../logs/LogsScreen'

export default function Dashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState(initialScreen(session.role))
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(key) {
    if (canAccess(session.role, key)) {
      setActiveTab(key)
      setMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Header session={session} onLogout={onLogout} onMenuOpen={() => setMenuOpen(true)} />

      {menuOpen && (
        <MobileDrawer
          session={session}
          activeTab={activeTab}
          onNavigate={navigate}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <div className="flex flex-1 min-h-0">
        <Sidebar role={session.role} activeTab={activeTab} onNavigate={navigate} />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === "dashboard" && <DashboardScreen session={session} onNavigate={navigate} />}
          {activeTab === "estoque"   && canAccess(session.role, "estoque")   && <StockScreen session={session} />}
          {activeTab === "caixa"     && canAccess(session.role, "caixa")     && <CashierScreen session={session} />}
          {activeTab === "usuarios"  && canAccess(session.role, "usuarios")  && <UsersScreen session={session} />}
          {activeTab === "logs"      && canAccess(session.role, "logs")      && <LogsScreen session={session} />}
        </main>
      </div>

    </div>
  )
}
