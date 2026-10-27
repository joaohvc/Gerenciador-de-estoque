import { LogOut, Menu, Search } from 'lucide-react'

export default function Topbar({ nomeFiltro, busca, onBuscaChange, onLogout }) {
  return (
    <header className="topbar">
      <button className="mobile-menu icon-button" type="button" aria-label="Abrir menu"><Menu size={19} /></button>
      <div className="breadcrumbs"><span>Início</span><span className="breadcrumb-separator">›</span><strong>{nomeFiltro}</strong></div>
      <label className="global-search">
        <Search size={16} />
        <input value={busca} onChange={(evento) => onBuscaChange(evento.target.value)} placeholder="Buscar produto ou código..." />
        <kbd>⌘ K</kbd>
      </label>
      <button className="topbar-logout" type="button" onClick={onLogout}>
        <LogOut size={15} /><span>Sair</span>
      </button>
    </header>
  )
}