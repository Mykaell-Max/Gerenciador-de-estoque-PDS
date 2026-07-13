import { ShoppingBag } from 'lucide-react'

export default function CashierScreen() {
  return (
    <div>
      <h2 className="text-gray-900 text-xl font-medium mb-4">Caixa</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-sm w-full">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Módulo de caixa em desenvolvimento.</p>
      </div>
    </div>
  )
}
