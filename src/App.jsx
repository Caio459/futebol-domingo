import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Scouts from './pages/Scouts'
import Ranking from './pages/Ranking'
import Perfil from './pages/Perfil'
import Pagamentos from './pages/Pagamentos'
import Admin from './pages/Admin'
import BottomNav from './components/BottomNav'

export default function App() {
  const [page, setPage] = useState('/')
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
