import { LoaderCircle, Trash2, X } from 'lucide-react'

export default function ConfirmDeleteModal({ produto, onClose, onConfirm, excluindo, erro }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(evento) => { if (evento.target === evento.currentTarget && !excluindo) onClose() }}>
      <section className="product-modal confirm-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
        <div className="modal-heading">
          <div>
            <span className="modal-icon delete-modal-icon"><Trash2 size={18} /></span>
            <div>
              <h2 id="delete-modal-title">Excluir produto</h2>
              <p>{produto.nome} · tamanho {produto.tamanho}</p>
            </div>
          </div>
          <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Fechar" disabled={excluindo}><X size={18} /></button>
        </div>
        <p className="delete-confirm-copy" id="delete-modal-description">Tem certeza de que deseja excluir este produto? Esta ação não poderá ser desfeita.</p>
        {erro && <p className="form-error" role="alert">{erro}</p>}
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose} disabled={excluindo}>Cancelar</button>
          <button type="button" className="delete-confirm-button" onClick={onConfirm} disabled={excluindo}>
            {excluindo ? <LoaderCircle className="spinning" size={16} /> : <Trash2 size={16} />}
            {excluindo ? 'Excluindo...' : 'Excluir produto'}
          </button>
        </div>
      </section>
    </div>
  )
}
