import { AlertCircle } from 'lucide-react'

export default function Feedback({ ok, text }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm border ${
      ok
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-600 border-red-200"
    }`}>
      <AlertCircle className="w-4 h-4 shrink-0" />
      {text}
    </div>
  )
}
