import { useEffect, useState } from 'react'
import { CalendarDays, Check, Plus, RefreshCw } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import ConfirmDeleteModal from '../components/forms/ConfirmDeleteModal'
import ProductFormModal from '../components/forms/ProductFormModal'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import InsightsPanel from '../components/ui/InsightsPanel'
import InventoryPanel from '../components/ui/InventoryPanel'
import OverviewBand from '../components/ui/OverviewBand'
import { atualizarProduto, cadastrarProduto, excluirProduto, listarProdutos } from '../services/produtos'
import { agruparProdutos, converterPreco, ESTOQUE_MINIMO, formatarData, formatarHora, normalizarGenero } from '../utils/estoque'

const nomesCategorias = {
  curto: 'Pijama short/camiseta manga curta',
  longo: 'Pijama calça/camiseta manga longa',
  kigurime: 'Kigurumi',
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [status, setStatus] = useState('carregando')
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [produtoExcluindo, setProdutoExcluindo] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState('')
  const [erroLogout, setErroLogout] = useState('')
  const [aviso, setAviso] = useState('')

  function carregarProdutos() {
    listarProdutos()
      .then((dados) => {
        setProdutos(Array.isArray(dados) ? dados : [])
        setStatus('ok')
      })
      .catch((erroRequisicao) => {
        setErro(erroRequisicao.message)
        setStatus('erro')
      })
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const modelos = agruparProdutos(produtos)
  const modelosVisiveis = modelos.filter((modelo) => {
    const [generoFiltro, categoriaFiltro] = filtro.split(':')
    const correspondeFiltro = filtro === 'todos'
      || (categoriaFiltro && modelo.genero === generoFiltro && modelo.categoria === categoriaFiltro)
    const termo = busca.trim().toLowerCase()
    const correspondeBusca = !termo || `${modelo.nome} ${modelo.codigo}`.toLowerCase().includes(termo)
    return correspondeFiltro && correspondeBusca
  })
  const produtosVisiveis = modelosVisiveis.flatMap((modelo) => modelo.variacoes.map((variacao) => variacao.produto))
  const totalPecas = produtosVisiveis.reduce((total, produto) => total + (Number(produto.quantidade) || 0), 0)
  const variacoesBaixas = produtosVisiveis.filter((produto) => Number(produto.quantidade) < ESTOQUE_MINIMO).length
  const femininos = modelosVisiveis.filter((modelo) => modelo.genero === 'feminino').length
  const masculinos = modelosVisiveis.filter((modelo) => modelo.genero === 'masculino').length
  const totalFeminino = produtosVisiveis.filter((produto) => normalizarGenero(produto.genero) === 'feminino').reduce((total, produto) => total + (Number(produto.quantidade) || 0), 0)
  const totalMasculino = produtosVisiveis.filter((produto) => normalizarGenero(produto.genero) === 'masculino').reduce((total, produto) => total + (Number(produto.quantidade) || 0), 0)
  const contagens = modelos.reduce((totais, modelo) => {
    if (modelo.genero === 'feminino' && ['curto', 'longo'].includes(modelo.categoria)) {
      const chave = `feminino:${modelo.categoria}`
      totais[chave] += 1
    } else if (modelo.genero === 'masculino' && ['curto', 'longo'].includes(modelo.categoria)) {
      const chave = `masculino:${modelo.categoria}`
      totais[chave] += 1
    }
    if (modelo.categoria === 'kigurime' && ['feminino', 'masculino'].includes(modelo.genero)) {
      const chave = `${modelo.genero}:kigurime`
      totais[chave] += 1
    }
    return totais
  }, {
    'feminino:curto': 0,
    'feminino:longo': 0,
    'masculino:curto': 0,
    'masculino:longo': 0,
    'feminino:kigurime': 0,
    'masculino:kigurime': 0,
  })

  function atualizarEstoque() {
    setErro('')
    setStatus('carregando')
    carregarProdutos()
  }

  async function sair() {
    setErroLogout('')
    try {
      await signOut()
    } catch {
      setErroLogout('Não foi possível encerrar sua sessão. Verifique a conexão e tente novamente.')
    }
  }

  function abrirCadastro() {
    setProdutoEditando(null)
    setErroCadastro('')
    setModalAberto(true)
  }

  function abrirEdicao(produto) {
    setProdutoEditando(produto)
    setErroCadastro('')
    setModalAberto(true)
  }

  function confirmarExclusao(produto) {
    setProdutoExcluindo(produto)
    setErroExclusao('')
  }

  async function excluirProdutoSelecionado() {
    if (!produtoExcluindo) return
    setExcluindo(true)
    setErroExclusao('')

    try {
      await excluirProduto(produtoExcluindo.id)
      setProdutos((atuais) => atuais.filter((produto) => produto.id !== produtoExcluindo.id))
      setAviso('Produto excluído com sucesso.')
      setProdutoExcluindo(null)
      window.setTimeout(() => setAviso(''), 3500)
    } catch (erroRequisicao) {
      setErroExclusao(erroRequisicao.message)
    } finally {
      setExcluindo(false)
    }
  }

  async function salvarProduto(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErroCadastro('')

    const dados = new FormData(evento.currentTarget)
    const produto = {
      codigoFabrica: dados.get('codigoFabrica').trim(),
      nome: dados.get('nome').trim(),
      tamanho: Number(dados.get('tamanho')),
      quantidade: Number(dados.get('quantidade')),
      genero: dados.get('genero'),
      categoria: dados.get('categoria'),
      precoComprado: converterPreco(dados.get('precoComprado')),
      preco: converterPreco(dados.get('preco')),
    }

    if (!Number.isFinite(produto.precoComprado) || !Number.isFinite(produto.preco)) {
      setErroCadastro('Informe os preços de compra e de venda usando valores numéricos.')
      setSalvando(false)
      return
    }

    try {
      if (produtoEditando) {
        await atualizarProduto(produtoEditando.id, produto)
      } else {
        await cadastrarProduto(produto)
      }
      setModalAberto(false)
      setProdutoEditando(null)
      setAviso(produtoEditando ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.')
      atualizarEstoque()
      window.setTimeout(() => setAviso(''), 3500)
    } catch (erroRequisicao) {
      setErroCadastro(erroRequisicao.message)
    } finally {
      setSalvando(false)
    }
  }

  const nomeFiltro = filtro === 'todos'
    ? 'Visão geral'
    : (() => {
      const [genero, categoria] = filtro.split(':')
      const nomeGenero = genero === 'feminino' ? 'Feminino' : 'Masculino'
      const nomeCategoria = nomesCategorias[categoria] ?? ''
      return categoria === 'kigurime'
        ? `Kigurumi ${nomeGenero.toLowerCase()}`
        : `${genero === 'feminino' ? 'Pijamas femininos' : 'Pijamas masculinos'} · ${nomeCategoria}`
    })()

  return (
    <div className="app-shell">
      <Sidebar filtro={filtro} onFiltroChange={setFiltro} contagens={contagens} usuario={user} />

      <main className="main-content" id="inicio">
        <Topbar nomeFiltro={nomeFiltro} busca={busca} onBuscaChange={setBusca} onLogout={sair} />

        <div className="page-content">
          {erroLogout && <div className="error-banner" role="alert">{erroLogout}</div>}
          <section className="page-heading">
            <div>
              <p className="eyebrow">PAINEL DE CONTROLE <span className="eyebrow-dot" /></p>
              <h1>Seu estoque de pijamas</h1>
              <p className="subtitle">Acompanhe seus produtos, tamanhos e prioridades em um só lugar.</p>
            </div>
            <button className="primary-button" type="button" onClick={abrirCadastro}>
              <Plus size={16} /> Novo produto
            </button>
          </section>

          <div className="context-row">
            <span className="date-label"><CalendarDays size={15} />{formatarData()}</span>
            <span className="sync-label"><span className={status === 'erro' ? 'sync-dot error' : 'sync-dot'} />
              {status === 'carregando' ? 'Atualizando estoque...' : status === 'erro' ? 'API indisponível' : `Estoque atualizado às ${formatarHora()}`}
            </span>
            <span className="section-badge">{filtro === 'todos' ? 'Todas as categorias' : nomeFiltro}</span>
          </div>

          {status === 'erro' && (
            <div className="error-banner" role="alert">
              <span>Não foi possível carregar o estoque ({erro}). Confirme se o backend está rodando e tente novamente.</span>
              <button type="button" onClick={atualizarEstoque}><RefreshCw size={15} /> Tentar novamente</button>
            </div>
          )}

          <OverviewBand
            status={status}
            totalPecas={totalPecas}
            modelos={modelosVisiveis.length}
            variacoes={produtosVisiveis.length}
            femininos={femininos}
            masculinos={masculinos}
            variacoesBaixas={variacoesBaixas}
            estoqueMinimo={ESTOQUE_MINIMO}
          />

          <div className="workspace-grid">
            <InventoryPanel
              modelosVisiveis={modelosVisiveis}
              produtosCount={produtosVisiveis.length}
              totalPecas={totalPecas}
              status={status}
              busca={busca}
              onBuscaChange={setBusca}
              filtro={filtro}
              onFiltroChange={setFiltro}
              onRefresh={atualizarEstoque}
              onCreate={abrirCadastro}
              onEdit={abrirEdicao}
              onDelete={confirmarExclusao}
              estoqueMinimo={ESTOQUE_MINIMO}
            />

            <InsightsPanel
              femininos={femininos}
              masculinos={masculinos}
              totalFeminino={totalFeminino}
              totalMasculino={totalMasculino}
              variacoesBaixas={variacoesBaixas}
              estoqueMinimo={ESTOQUE_MINIMO}
              onOverview={() => setFiltro('todos')}
            />
          </div>

          <footer className="page-footer"><span>Jolu Pijamas <span>·</span> Gestão de estoque</span><span>Feito com cuidado <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>

      {aviso && <div className="toast" role="status"><Check size={17} />{aviso}</div>}

      {produtoExcluindo && (
        <ConfirmDeleteModal
          produto={produtoExcluindo}
          onClose={() => { if (!excluindo) setProdutoExcluindo(null) }}
          onConfirm={excluirProdutoSelecionado}
          excluindo={excluindo}
          erro={erroExclusao}
        />
      )}

      {modalAberto && (
        <ProductFormModal
          key={produtoEditando?.id ?? 'novo-produto'}
          onClose={() => { setModalAberto(false); setProdutoEditando(null) }}
          onSubmit={salvarProduto}
          salvando={salvando}
          erroCadastro={erroCadastro}
          produto={produtoEditando}
        />
      )}
    </div>
  )
}