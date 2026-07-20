const BASE_URL = import.meta.env.VITE_API_URL || "https://gerenciador-de-estoque-pds.onrender.com"

export async function api(path, method = "GET", body = null, role = null, name = null) {
  const headers = { "Content-Type": "application/json" }
  if (role) headers["x-user-role"] = role
  if (name) headers["x-user-name"] = name
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Erro desconhecido.")
  return data
}
