import { LoaderCircle, Package, Pencil, Plus, X } from 'lucide-react'
import { converterPreco, normalizarCategoria } from '../../utils/estoque'

export default function ProductFormModal({ onClose, onSubmit, salvando, erroCadastro, produto }) {
  const editando = Boolean(produto)
  const genero = produto?.genero?.toLowerCase().startsWith('m')
    ? 'm'
    : produto?.genero?.toLowerCase().startsWith('f')
      ? 'f'
      : produto
        ? ''
        : 'f'
  const categoria = normalizarCategoria(produto?.categoria ?? '')

  function formatarCampoPreco(evento) {
    const valor = converterPreco(evento.currentTarget.value)
    if (Number.isFinite(valor)) {
      evento.currentTarget.value = valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) onClose() }}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className="modal-icon">{editando ? <Pencil size={18} /> : <Package size={18} />}</span><div><h2 id="modal-title">{editando ? 'Atualizar produto' : 'Novo produto'}</h2><p>{editando ? 'Edite as informações desta variação do estoque.' : 'Adicione uma variação ao seu estoque.'}</p></div></div><button className="icon-button close-button" type="button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div>
        <form onSubmit={onSubmit}>
          <label className="form-field">Nome do produto<input name="nome" placeholder="Ex.: Pijama Aurora" required maxLength="100" defaultValue={produto?.nome ?? ''} /></label>
          <label className="form-field">Código de fábrica<input name="codigoFabrica" placeholder="Ex.: JOL-001" required maxLength="40" defaultValue={produto?.codigoFabrica ?? ''} /></label>
          <div className="form-row">
            <label className="form-field">Tamanho<input name="tamanho" type="number" min="1" max={editando ? 18 : 19} placeholder="Ex.: 1" required defaultValue={produto?.tamanho ?? ''} /></label>
            <label className="form-field">Quantidade<input name="quantidade" type="number" min="0" placeholder="0" required defaultValue={produto?.quantidade ?? ''} /></label>
          </div>
          <div className="form-row">
            <label className="form-field">Gênero<select name="genero" defaultValue={genero} required><option value="" disabled>Selecione</option><option value="f">Feminino</option><option value="m">Masculino</option></select></label>
            <label className="form-field">Categoria<select name="categoria" defaultValue={categoria} required><option value="" disabled>Selecione</option><option value="curto">Pijama short / camiseta manga curta</option><option value="longo">Pijama calça / camiseta manga longa</option><option value="kigurime">Kigurumi</option></select></label>
          </div>
          <div className="form-row">
            <label className="form-field">Preço de compra (R$)<input name="precoComprado" type="text" inputMode="decimal" placeholder="Ex.: 49,90" onBlur={formatarCampoPreco} required defaultValue={produto?.precoComprado == null ? '' : Number(produto.precoComprado).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></label>
            <label className="form-field">Preço de venda (R$)<input name="preco" type="text" inputMode="decimal" placeholder="Ex.: 69,90" onBlur={formatarCampoPreco} required defaultValue={produto?.preco == null ? '' : Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></label>
          </div>
          {erroCadastro && <p className="form-error" role="alert">{erroCadastro}</p>}
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={salvando}>Cancelar</button><button className="primary-button" type="submit" disabled={salvando}>{salvando ? <LoaderCircle className="spinning" size={16} /> : editando ? <Pencil size={16} /> : <Plus size={16} />}{salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar produto'}</button></div>
        </form>
      </section>
    </div>
  )
}