import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react'

export default function InsightsPanel({
  femininos,
  masculinos,
  totalFeminino,
  totalMasculino,
  variacoesBaixas,
  estoqueMinimo,
  onOverview,
}) {
  return (
    <aside className="insights-panel">
      <div className="insights-heading"><div><span className="insights-icon"><Sparkles size={15} /></span><h2>Resumo rápido</h2></div><span className="today-tag">HOJE</span></div>
      <div className="insight-item">
        <div className="insight-icon green"><ArrowUpRight size={17} /></div>
        <div><strong>Estoque feminino</strong><span>{femininos} modelos cadastrados</span></div>
        <span className="insight-value">{totalFeminino}</span>
      </div>
      <div className="insight-item">
        <div className="insight-icon blue"><ArrowDownRight size={17} /></div>
        <div><strong>Estoque masculino</strong><span>{masculinos} modelos cadastrados</span></div>
        <span className="insight-value">{totalMasculino}</span>
      </div>
      <div className="insights-divider" />
      <div className="attention-heading"><span>Pontos de atenção</span><span className="attention-count">{variacoesBaixas}</span></div>
      {variacoesBaixas > 0 ? (
        <p className="attention-copy">{variacoesBaixas === 1 ? 'Uma variação está' : `${variacoesBaixas} variações estão`} abaixo do estoque mínimo de {estoqueMinimo} peças.</p>
      ) : (
        <p className="attention-copy">Tudo certo por aqui. Nenhuma variação abaixo do estoque mínimo.</p>
      )}
      <div className="minimum-note"><span className="minimum-dot" /> Mínimo definido: {estoqueMinimo} peças por tamanho</div>
      <button className="insight-link" type="button" onClick={onOverview}>Ver visão geral <span>↗</span></button>
    </aside>
  )
}