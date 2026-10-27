import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './context'
import { autenticarComGoogle, encerrarSessao, verificarSessao } from '../services/auth'

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking')
  const [user, setUser] = useState(null)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    let active = true

    verificarSessao()
      .then((usuario) => {
        if (!active) return
        setUser(usuario)
        setStatus('authenticated')
      })
      .catch((error) => {
        if (!active) return
        if (error.status === 401) {
          setStatus('anonymous')
          return
        }
        setSessionError('Não foi possível verificar sua sessão. Verifique a conexão com o servidor e tente novamente.')
        setStatus('error')
      })

    function handleSessionExpired() {
      setUser(null)
      setStatus('anonymous')
      setSessionError('Sua sessão expirou. Entre novamente para continuar.')
    }

    window.addEventListener('jolu:session-expired', handleSessionExpired)
    return () => {
      active = false
      window.removeEventListener('jolu:session-expired', handleSessionExpired)
    }
  }, [])

  async function signIn(credential) {
    const usuario = await autenticarComGoogle(credential)
    setUser(usuario)
    setSessionError('')
    setStatus('authenticated')
  }

  async function signOut() {
    await encerrarSessao()
    setUser(null)
    setSessionError('')
    setStatus('anonymous')
  }

  const value = useMemo(() => ({
    status,
    user,
    sessionError,
    signIn,
    signOut,
  }), [status, user, sessionError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
