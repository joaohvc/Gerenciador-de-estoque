export const ESTOQUE_MINIMO = 5

export function normalizarGenero(genero = '') {
  const valor = genero.toString().trim().toLowerCase()
  if (valor.startsWith('f')) return 'feminino'
  if (valor.startsWith('m')) return 'masculino'
  return 'outro'
}

export function normalizarCategoria(categoria = '') {
  const valor = (categoria ?? '').toString().trim().toLowerCase()
  return valor === 'kigurumi' ? 'kigurime' : valor
}

export function rotularCategoria(categoria = '') {
  const valor = normalizarCategoria(categoria)
  if (valor === 'curto') return 'Manga curta'
  if (valor === 'longo') return 'Manga longa'
  if (valor === 'kigurime') return 'Kigurumi'
  return 'Sem categoria'
}

export function formatarMoeda(valor) {
  if (valor == null || valor === '') return '—'
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return '—'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numero)
}

export function converterPreco(valor) {
  const texto = String(valor).trim().replace(/\s/g, '').replace(/^R\$/, '')
  if (!texto) return Number.NaN

  const normalizado = texto.includes(',')
    ? texto.replace(/\./g, '').replace(',', '.')
    : texto
  return Number(normalizado)
}

export function agruparProdutos(produtos) {
  const grupos = new Map()

  produtos.forEach((produto) => {
    const genero = normalizarGenero(produto.genero)
    const categoria = normalizarCategoria(produto.categoria)
    const nome = produto.nome || 'Produto sem nome'
    const codigo = produto.codigoFabrica || 'Sem código'
    const chave = `${codigo}-${nome}-${genero}-${categoria}`

    if (!grupos.has(chave)) {
      grupos.set(chave, { codigo, nome, genero, categoria, variacoes: [] })
    }
    grupos.get(chave).variacoes.push({
      produto,
      tamanho: produto.tamanho,
      quantidade: Number(produto.quantidade) || 0,
    })
  })

  return [...grupos.values()].map((grupo) => ({
    ...grupo,
    variacoes: grupo.variacoes.sort((a, b) => Number(a.tamanho) - Number(b.tamanho)),
    total: grupo.variacoes.reduce((total, variacao) => total + variacao.quantidade, 0),
  }))
}

export function formatarData() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

export function formatarHora() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}