const API_BASE = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
  })
  const body = await response.text()

  if (!response.ok) {
    const error = new Error(body || `Falha na autenticação (${response.status})`)
    error.status = response.status
    throw error
  }

  if (!body) return null
  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

export function verificarSessao() {
  return request('/auth/session')
}

export function autenticarComGoogle(credential) {
  return request('/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  })
}

export function encerrarSessao() {
  return request('/auth/logout', { method: 'POST' })
}
