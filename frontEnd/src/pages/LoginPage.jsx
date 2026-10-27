import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function LoginPage({ googleClientConfigured }) {
  const { status, sessionError, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState(location.state?.sessionError ?? '')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(location.state?.from?.pathname ?? '/', { replace: true })
    }
  }, [status, navigate, location.state])

  async function handleGoogleSuccess(response) {
    if (!response.credential) {
      setError('O Google não retornou um token de autenticação. Tente novamente.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await signIn(response.credential)
    } catch {
      setError('Não foi possível validar seu acesso. Verifique sua conta e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark"><Sparkles size={21} strokeWidth={1.7} /></span>
          <span>jolupijamas</span>
        </div>

        <div className="login-heading">
          <p className="login-eyebrow">GESTÃO DE ESTOQUE</p>
          <h1 id="login-title">Bem-vindo ao JoluPijamas</h1>
          <p>Entre com sua conta Google para acessar seu gerenciador de estoque.</p>
        </div>

        <div className="login-action">
          {googleClientConfigured ? (
            submitting ? (
              <div className="login-progress" role="status">
                <span className="loading-spinner" />
                Validando seu acesso...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('O login com o Google não foi concluído. Tente novamente.')}
                text="signin_with"
                shape="rectangular"
                size="large"
                width="340"
                useOneTap={false}
              />
            )
          ) : (
            <div className="login-config-error" role="alert">
              O login Google ainda não está configurado. Defina a variável pública VITE_GOOGLE_CLIENT_ID.
            </div>
          )}
          {(error || sessionError) && (
            <p className="login-error" role="alert">{error || sessionError}</p>
          )}
        </div>

        <div className="login-security">
          <ShieldCheck size={16} />
          <span>Sua sessão é protegida e validada pelo servidor.</span>
        </div>
      </section>
      <p className="login-footer">Jolu Pijamas <span>·</span> Cuidado em cada detalhe</p>
    </main>
  )
}
