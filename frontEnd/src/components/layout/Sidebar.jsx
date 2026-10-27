import { useState } from 'react'
import {
  ChevronDown,
  LayoutDashboard,
  Shirt,
  Sparkles,
} from 'lucide-react'

const categoriasPorGenero = [
  { genero: 'feminino', rotulo: 'Pijamas femininos', categorias: [['curto', 'Manga curta'], ['longo', 'Manga longa']] },
  { genero: 'masculino', rotulo: 'Pijamas masculinos', categorias: [['curto', 'Manga curta'], ['longo', 'Manga longa']] },
]

export default function Sidebar({ filtro, onFiltroChange, contagens, usuario }) {
  const [kigurumiExpandido, setKigurumiExpandido] = useState(true)

  function filtroCategoria(genero, categoria) {
    return `${genero}:${categoria}`
  }

  return (
    <aside className="sidebar">
      <a className="brand" href="#inicio" onClick={() => onFiltroChange('todos')}>
        <span className="brand-mark"><Sparkles size={19} strokeWidth={1.7} /></span>
        <span>
          <strong>jolupijamas</strong>
          <small>CUIDADO EM CADA DETALHE</small>
        </span>
      </a>

      <button className="store-switcher" type="button">
        <span className="store-icon"><Shirt size={17} /></span>
        <span className="store-copy"><strong>Minha loja</strong><small>Estoque principal</small></span>
        <ChevronDown size={15} />
      </button>

      <div className="side-label">ESTOQUE POR TIPO</div>
      <nav className="main-nav" aria-label="Navegação principal">
        <button className={`nav-item${filtro === 'todos' ? ' active' : ''}`} aria-current={filtro === 'todos' ? 'page' : undefined} onClick={() => onFiltroChange('todos')} type="button">
          <LayoutDashboard size={16} /><span>Visão geral</span>
        </button>
        {categoriasPorGenero.map(({ genero, rotulo, categorias }) => (
          <div className="nav-group" key={genero}>
            <div className="nav-group-title"><Shirt size={14} /><span>{rotulo}</span></div>
            <div className="nav-group-items">
              {categorias.map(([categoria, nome]) => {
                const valorFiltro = filtroCategoria(genero, categoria)
                return (
                  <button
                    className={`nav-item nav-subitem${filtro === valorFiltro ? ' active' : ''}`}
                    aria-current={filtro === valorFiltro ? 'page' : undefined}
                    key={categoria}
                    onClick={() => onFiltroChange(valorFiltro)}
                    type="button"
                  >
                    <span>{nome}</span><span className="nav-count">{contagens[valorFiltro]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        <div className="nav-group">
          <button
            className={`nav-group-title nav-group-toggle${filtro.endsWith(':kigurime') ? ' selected' : ''}`}
            aria-expanded={kigurumiExpandido}
            aria-controls="kigurumi-subcategorias"
            onClick={() => setKigurumiExpandido((expandido) => !expandido)}
            type="button"
          >
            <Sparkles size={14} /><span>Kigurumi</span><ChevronDown className={kigurumiExpandido ? '' : 'collapsed'} size={13} />
          </button>
          {kigurumiExpandido && (
            <div className="nav-group-items" id="kigurumi-subcategorias">
              {['masculino', 'feminino'].map((genero) => {
                const valorFiltro = filtroCategoria(genero, 'kigurime')
                const nome = genero === 'masculino' ? 'Masculino' : 'Feminino'
                return (
                  <button
                    className={`nav-item nav-subitem${filtro === valorFiltro ? ' active' : ''}`}
                    aria-current={filtro === valorFiltro ? 'page' : undefined}
                    key={genero}
                    onClick={() => onFiltroChange(valorFiltro)}
                    type="button"
                  >
                    <span>{nome}</span><span className="nav-count">{contagens[valorFiltro]}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="profile">
          {usuario?.foto
            ? <img className="profile-avatar" src={usuario.foto} alt="" />
            : <div className="profile-avatar">{(usuario?.nome || usuario?.email || 'J').charAt(0).toUpperCase()}</div>}
          <div><strong>{usuario?.nome || 'Conta Google'}</strong><small>{usuario?.email || 'Sessão autenticada'}</small></div>
        </div>
      </div>
    </aside>
  )
}