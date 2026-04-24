import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://futebol-domingo.vercel.app'
      }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">⚽</div>
          <h1 className="text-white text-3xl font-bold">Futebol de Domingo</h1>
          <p className="text-gray-400 mt-2">Temporada 2025</p>
        </div>

        <div className="bg-[#111827] rounded-2xl p-6 border border-[#1a5c2a]">
          <h2 className="text-white font-bold text-lg mb-2">Bem-vindo! 👋</h2>
          <p className="text-gray-400 text-sm mb-6">Entre com sua conta Google para acessar o app do grupo.</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Apenas membros do grupo podem acessar
        </p>
      </div>
    </div>
  )
}
