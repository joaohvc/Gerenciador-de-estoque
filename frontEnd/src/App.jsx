import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const application = (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage googleClientConfigured={Boolean(googleClientId)} />} />
          <Route path="/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )

  return googleClientId
    ? <GoogleOAuthProvider clientId={googleClientId}>{application}</GoogleOAuthProvider>
    : application
}
