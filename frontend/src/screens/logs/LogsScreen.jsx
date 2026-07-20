import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function formatarDataHora(dataHoraStr) {
  const d = new Date(dataHoraStr)
  if (isNaN(d)) return dataHoraStr
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function LogsScreen({ session }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarLogs()
  }, [])

  async function carregarLogs() {
    setLoading(true)
    try {
      const data = await api("/logs", "GET", null, session.role)
      setLogs(data.logs || [])
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900 text-xl font-medium">Logs de Auditoria</h2>
        <button
          onClick={carregarLogs}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Nenhuma ação registrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Usuário", "Ação realizada", "Data", "Hora"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => {
                  const dt = new Date(log.data_hora)
                  const data = isNaN(dt)
                    ? log.data_hora
                    : dt.toLocaleDateString('pt-BR')
                  const hora = isNaN(dt)
                    ? ""
                    : dt.toLocaleTimeString('pt-BR')

                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                        {log.usuario_nome}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.acao}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {data}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {hora}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        {logs.length} {logs.length === 1 ? "registro" : "registros"} · mais recentes primeiro
      </p>
    </div>
  )
}
