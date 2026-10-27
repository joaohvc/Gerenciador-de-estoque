const API_BASE = '/api'

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
  })
  const body = await response.text()

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('jolu:session-expired'))
    }
    throw new Error(body || `Falha na API (${response.status})`)
  }

  if (!body) return null
  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

export function listarProdutos() {
  return request('/produtos')
}

export function cadastrarProduto(produto) {
  return request('/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  })
}

export function atualizarProduto(id, produto) {
  return request(`/produtos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  })
}

export function excluirProduto(id) {
  return request(`/produtos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export function buscarPorNome(nome) {
  return request(`/produtos/nome/${encodeURIComponent(nome)}`)
}

export function buscarPorCodigo(codigo) {
  return request(`/produtos/codigo/${encodeURIComponent(codigo)}`)
}

export function buscarPorTamanho(tamanho) {
  return request(`/produtos/tamanho/${encodeURIComponent(tamanho)}`)
}