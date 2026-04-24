import { useState, useEffect } from 'react'
import { Target, TrendingUp, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

const pagamentos = [
  { mes: 'Abril 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Março 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Fevereiro 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Janeiro 2025', status: 'pendente', valor: 'R$ 80' },
]

export default function Perfil() {
  const [aba, setAba] = useState(0)
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [eventos, setEventos] = useState([])
  const [partidas, setPartidas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: p } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()
        setPerfil(p)

        if (p) {
          const { data: ev } = await supabase
            .from('match_events')
            .select('*, matches(*)')
            .eq('user_id', p.id)
          setEventos(ev || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const gols = eventos.filter(e => e.type === 'goal').length
  const assists = eventos.filter(e => e.type === 'assist').length
  const nome = perfil?.name || user?.email?.split('@')[0] || 'Jogador'
  const avatar = perfil?.avatar || '👤'
  const posicao = perfil?.position || 'Posição não definida'
  const numero = perfil?.number || '--'
  const tipo = perfil?.player_type || 'mensalista'

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pb-20">
      <div className="text-5xl animate-spin">⚽</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 pt-6 px-4">

      {/* Card do jogador */}
      <div className="bg-gradient-to-br from-[#1a5c2a] to-[#0a2e14] rounded-2xl p-6 mb-6 text-center border border-[#1a5c2a]">
        <div className="w-20 h-20 rounded-full bg-[#0a0a0a]/40 flex items-center justify-center text-5xl mx-auto mb-3">
          {avatar}
        </div>
        <h1 className="text-white text-2xl font-bold">{nome}</h1>
        <p className="text-gray-300 text-sm mt-1">{posicao} • #{numero}</p>
        <span className="inline-block mt-2 bg-[#f5c518]/20 text-[#f5c518] text-xs font-bold px-3 py-1 rounded-full uppercase">
          {tipo}
        </span>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">{gols}</p>
            <p className="text-gray-300 text-xs">Gols</p>
          </div>
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">{assists}</p>
            <p className="text-gray-300 text-xs">Assists</p>
          </div>
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">{new Set(eventos.map(e=>e.match_id)).size}</p>
            <p className="text-gray-300 text-xs">Jogos</p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex bg-[#111827] rounded-xl p-1 mb-5">
        {['Histórico', 'Pagamentos'].map((a, i) => (
          <button key={a} onClick={() => setAba(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${aba === i ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
            {a}
          </button>
        ))}
      </div>

      {/* Histórico */}
      {aba === 0 && (
        <div className="space-y-3">
          {eventos.length === 0 ? (
            <div className="bg-[#111827] rounded-2xl p-6 text-center border border-gray-800">
              <p className="text-gray-400 text-sm">Nenhum evento registrado ainda</p>
            </div>
          ) : eventos.slice(0, 10).map((ev, i) => (
            <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {ev.type === 'goal' ? '⚽ Gol' : ev.type === 'assist' ? '🎯 Assistência' : '↩️ Gol Contra'}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {ev.matches?.date ? new Date(ev.matches.date).toLocaleDateString('pt-BR') : 'Data não definida'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagamentos */}
      {aba === 1 && (
        <div className="space-y-3">
          {pagamentos.map((p, i) => (
            <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className={p.status === 'pago' ? 'text-green-400' : 'text-yellow-400'} />
                <div>
                  <p className="text-white font-semibold text-sm">{p.mes}</p>
                  <p className="text-gray-400 text-xs">{p.valor}</p>
                </div>
              </div>
              {p.status === 'pago'
                ? <span className="flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full"><CheckCircle size={11} /> PAGO</span>
                : <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full"><Clock size={11} /> PENDENTE</span>
              }
            </div>
          ))}
        </div>
      )}

      {/* Botão sair */}
      <button onClick={handleLogout}
        className="w-full mt-6 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 rounded-2xl">
        🚪 Sair da conta
      </button>
    </div>
  )
}
