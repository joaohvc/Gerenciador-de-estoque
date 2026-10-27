import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export default function ProtectedRoute({ children }) {
  const { status, sessionError } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <main className="auth-loading" role="status">
        <span className="loading-spinner" />
        <p>Verificando sua sessão...</p>
      </main>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location, sessionError }} />
  }

  return children
}
