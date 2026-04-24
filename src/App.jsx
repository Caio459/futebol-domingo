import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Scouts from './pages/Scouts'
import Ranking from './pages/Ranking'
import Perfil from './pages/Perfil'
import Pagamentos from './pages/Pagamentos'
import Admin from './pages/Admin'
import BottomNav from './components/BottomNav'

export default function App() {
  const [page, setPage] = useState('/')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-5xl animate-spin">⚽</div>
    </div>
  )

  if (!session) return <Login />

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      {page === '/' && <Dashboard />}
      {page === '/scouts' && <Scouts />}
      {page === '/ranking' && <Ranking />}
      {page === '/perfil' && <Perfil />}
      {page === '/pagamentos' && <Pagamentos />}
      {page === '/admin' && <Admin />}
      <BottomNav current={page} onChange={setPage} />
    </div>
  )
}
