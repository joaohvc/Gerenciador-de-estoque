import { Box, Package } from 'lucide-react'

export default function OverviewBand({ status, totalPecas, modelos, variacoes, femininos, masculinos, variacoesBaixas, estoqueMinimo }) {
  return (
    <section className="overview-band" aria-label="Resumo do estoque">
      <div className="overview-main">
        <div className="overview-label"><span className="overview-icon"><Package size={16} /></span> Peças em estoque</div>
        <div className="overview-number">{status === 'carregando' ? '—' : totalPecas.toLocaleString('pt-BR')}</div>
        <p>{modelos} {modelos === 1 ? 'modelo' : 'modelos'} · {variacoes} variações de tamanho</p>
      </div>
      <div className="overview-divider" />
      <div className="overview-stat">
        <span className="stat-caption">MODELOS FEMININOS</span>
        <strong>{femininos.toString().padStart(2, '0')}</strong>
        <span className="stat-note">no catálogo</span>
      </div>
      <div className="overview-stat">
        <span className="stat-caption">MODELOS MASCULINOS</span>
        <strong>{masculinos.toString().padStart(2, '0')}</strong>
        <span className="stat-note">no catálogo</span>
      </div>
      <div className="overview-stat alert-stat">
        <span className="stat-caption">TAMANHOS PARA REPOR</span>
        <strong>{variacoesBaixas.toString().padStart(2, '0')}</strong>
        <span className="stat-note">abaixo de {estoqueMinimo} peças</span>
      </div>
      <Box className="overview-decoration" size={20} strokeWidth={1.4} />
    </section>
  )
}