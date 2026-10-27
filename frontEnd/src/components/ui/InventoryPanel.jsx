import { LoaderCircle, Package, RefreshCw, Search, Shirt, Trash2, X, ChevronDown, Plus } from 'lucide-react'
import { formatarMoeda, rotularCategoria } from '../../utils/estoque'

export default function InventoryPanel({
  modelosVisiveis,
  produtosCount,
  totalPecas,
  status,
  busca,
  onBuscaChange,
  filtro,
  onFiltroChange,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
  estoqueMinimo,
}) {
  function editarProdutoDaLinha(evento, modelo) {
    const variacaoClicada = evento.target.closest('[data-product-id]')
    const produto = variacaoClicada
      ? modelo.variacoes.find((variacao) => String(variacao.produto.id) === variacaoClicada.dataset.productId)?.produto
      : modelo.variacoes.find((variacao) => variacao.produto.id != null)?.produto

    if (produto) onEdit(produto)
  }

  function editarProdutoPeloTeclado(evento, modelo) {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      editarProdutoDaLinha(evento, modelo)
    }
  }

  return (
    <section className="inventory-panel">
      <div className="panel-heading">
        <div>
          <div className="panel-title-row"><h2>Produtos em estoque</h2><span className="count-badge">{modelosVisiveis.length} {modelosVisiveis.length === 1 ? 'modelo' : 'modelos'}</span></div>
          <p>Visão consolidada por modelo e tamanho</p>
        </div>
        <button className="text-button" type="button" onClick={onRefresh} disabled={status === 'carregando'}>
          <RefreshCw size={14} className={status === 'carregando' ? 'spinning' : ''} /> Atualizar
        </button>
      </div>

      <div className="table-toolbar">
        <label className="table-search"><Search size={15} /><input value={busca} onChange={(evento) => onBuscaChange(evento.target.value)} placeholder="Buscar por nome ou código" />{busca && <button type="button" onClick={() => onBuscaChange('')} aria-label="Limpar busca"><X size={14} /></button>}</label>
        <label className="filter-select"><span className="sr-only">Filtrar categoria</span><select value={filtro} onChange={(evento) => onFiltroChange(evento.target.value)}><option value="todos">Todas as categorias</option><optgroup label="Pijamas femininos"><option value="feminino:curto">Manga curta</option><option value="feminino:longo">Manga longa</option></optgroup><optgroup label="Pijamas masculinos"><option value="masculino:curto">Manga curta</option><option value="masculino:longo">Manga longa</option></optgroup><optgroup label="Kigurumi"><option value="masculino:kigurime">Masculino</option><option value="feminino:kigurime">Feminino</option></optgroup></select><ChevronDown size={14} /></label>
      </div>

      {status === 'carregando' && produtosCount === 0 ? (
        <div className="empty-state"><LoaderCircle className="spinning" size={22} /><span>Carregando produtos...</span></div>
      ) : modelosVisiveis.length === 0 ? (
        <div className="empty-state"><Package size={23} /><strong>{busca ? 'Nenhum produto encontrado' : 'Seu estoque começa aqui'}</strong><span>{busca ? 'Tente buscar por outro nome ou código.' : 'Cadastre seu primeiro produto para acompanhar o estoque.'}</span>{!busca && <button type="button" className="text-button" onClick={onCreate}><Plus size={15} /> Cadastrar produto</button>}</div>
      ) : (
        <div className="table-scroll">
          <table className="inventory-table">
            <thead><tr><th>PRODUTO</th><th></th><th>PREÇO DE COMPRA</th><th>PREÇO DE VENDA</th><th className="total-heading">TOTAL</th><th>SITUAÇÃO</th><th className="actions-heading"><span className="sr-only">Ações</span></th></tr></thead>
            <tbody>
              {modelosVisiveis.map((modelo) => {
                const temZerado = modelo.variacoes.some((variacao) => variacao.quantidade === 0)
                const temBaixo = modelo.variacoes.some((variacao) => variacao.quantidade > 0 && variacao.quantidade < estoqueMinimo)
                const situacao = temZerado ? 'Repor' : temBaixo ? 'Atenção' : 'Em dia'
                return (
                  <tr
                    key={`${modelo.codigo}-${modelo.nome}-${modelo.genero}-${modelo.categoria}`}
                    className="product-row"
                    role="button"
                    tabIndex={modelo.variacoes.some((variacao) => variacao.produto.id != null) ? 0 : -1}
                    aria-label={`Atualizar produto ${modelo.nome}. Na área dos tamanhos, selecione a variação desejada.`}
                    aria-disabled={!modelo.variacoes.some((variacao) => variacao.produto.id != null)}
                    onClick={(evento) => editarProdutoDaLinha(evento, modelo)}
                    onKeyDown={(evento) => editarProdutoPeloTeclado(evento, modelo)}
                  >
                    <td><div className="product-cell"><div className={`product-thumb ${modelo.genero}`}><Shirt size={19} strokeWidth={1.5} /></div><div className="product-info"><strong>{modelo.nome}</strong><span>{modelo.genero === 'feminino' ? 'Feminino' : modelo.genero === 'masculino' ? 'Masculino' : 'Sem gênero'} · {rotularCategoria(modelo.categoria)} · {modelo.codigo}</span></div></div></td>
                    <td><div className="size-list">{modelo.variacoes.map((variacao) => <div className={`size-chip ${variacao.quantidade === 0 ? 'zero' : variacao.quantidade < estoqueMinimo ? 'low' : ''}`} key={variacao.produto.id ?? `${modelo.codigo}-${variacao.tamanho}`} data-product-id={variacao.produto.id} title={`Atualizar ${modelo.nome}, tamanho ${variacao.tamanho}`}><span className="size-chip-value"><small>Tamanho</small><strong>{variacao.tamanho}</strong></span><span className="size-chip-value"><small>Quantidade</small><strong>{variacao.quantidade}</strong></span></div>)}</div></td>
                    <td><div className="price-list">{modelo.variacoes.map((variacao) => <span className="price-item" key={variacao.produto.id ?? `${modelo.codigo}-${variacao.tamanho}`}><strong>{formatarMoeda(variacao.produto.precoComprado)}</strong></span>)}</div></td>
                    <td><div className="price-list">{modelo.variacoes.map((variacao) => <span className="price-item" key={variacao.produto.id ?? `${modelo.codigo}-${variacao.tamanho}`}><strong>{formatarMoeda(variacao.produto.preco)}</strong></span>)}</div></td>
                    <td className="total-cell">{modelo.total}</td>
                    <td><span className={`status-pill ${situacao === 'Repor' ? 'reorder' : situacao === 'Atenção' ? 'attention' : ''}`}><span />{situacao}</span></td>
                    <td className="product-actions-cell">
                      <div className="product-actions-list">
                        {modelo.variacoes.map((variacao) => (
                          <button
                            key={variacao.produto.id ?? `${modelo.codigo}-${variacao.tamanho}`}
                            className="delete-product-button"
                            type="button"
                            aria-label={`Excluir ${modelo.nome}, tamanho ${variacao.tamanho}`}
                            title={`Excluir ${modelo.nome}, tamanho ${variacao.tamanho}`}
                            disabled={variacao.produto.id == null}
                            onClick={(evento) => {
                              evento.stopPropagation()
                              onDelete(variacao.produto)
                            }}
                            onKeyDown={(evento) => evento.stopPropagation()}
                          >
                            <Trash2 size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-footer"><span>{modelosVisiveis.length} modelos · {produtosCount} variações · {totalPecas} peças</span><span>Estoque mínimo: {estoqueMinimo} peças por tamanho</span></div>
    </section>
  )
}