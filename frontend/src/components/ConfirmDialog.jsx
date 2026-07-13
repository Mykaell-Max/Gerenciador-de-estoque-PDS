import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmLabel = "Confirmar", onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-gray-900 font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-60"
          >
            {loading ? "Removendo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
