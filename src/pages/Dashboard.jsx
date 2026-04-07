import { useEffect, useState } from 'react'
import { Trophy, Target, TrendingUp, CreditCard, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'

const medals = ['🥇', '🥈', '🥉']

export default function Dashboard() {
  const [jogadores, setJogadores] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: users } = await supabase.from('users').select('*').eq('active', true)
      const { data: events } = await supabase.from('match_events').select('*')
      setJogadores(users || [])
      setEventos(events || [])
      setLoading(false)
    }
    load()
  }, [])

  const gols = eventos.filter(e => e.type === 'goal').length
  const assists = eventos.filter(e => e.type === 'assist').length

  const ranking = jogadores.map(j => ({
    ...j,
    gols: eventos.filter(e => e.user_id === j.id && e.type === 'goal').length,
    assists: eventos.filter(e => e.user_id === j.id && e.type === 'assist').length,
  })).sort((a, b) => b.gols - a.gols).slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Temporada 2025</p>
          <h1 className="text-white text-2xl font-bold">⚽ Futebol de Domingo</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1a5c2a] flex items-center justify-center text-xl">👤</div>
      </div>

      <div className="bg-[#111827] border border-[#1a5c2a] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-[#f5c518]" />
          <span className="text-[#f5c518] text-sm font-semibold">Próximo Jogo</span>
        </div>
        <p className="text-white font-bold text-lg">Domingo, 13 de Abril</p>
        <p className="text-gray-400 text-sm">08:00 • Arena Society SP</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <Target size={20} className="text-[#1a5c2a] mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : gols}</p>
          <p className="text-gray-400 text-xs">Gols</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <TrendingUp size={20} className="text-[#f5c518] mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : assists}</p>
          <p className="text-gray-400 text-xs">Assistências</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <Trophy size={20} className="text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : jogadores.length}</p>
          <p className="text-gray-400 text-xs">Jogadores</p>
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl p-4 mb-6 border border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-green-400" />
          <div>
            <p className="text-white font-semibold">Mensalidade Abril</p>
            <p className="text-gray-400 text-sm">Vencimento: 10/04</p>
          </div>
        </div>
        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">✅ PAGO</span>
      </div>

      <div className="bg-[#111827] rounded-2xl p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={18} className="text-[#f5c518]" />
          <h2 className="text-white font-bold">Top Artilheiros</h2>
          <span className="text-gray-500 text-xs ml-auto">Temporada 2025</span>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-4">Carregando...</p>
        ) : ranking.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nenhum gol registrado ainda</p>
        ) : (
          <div className="space-y-3">
            {ranking.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-lg w-6">{medals[i] || `${i+1}°`}</span>
                <div className="w-9 h-9 rounded-full bg-[#1a5c2a]/30 flex items-center justify-center text-lg">{p.avatar}</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.assists} assistências</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f5c518] font-bold">{p.gols}</p>
                  <p className="text-gray-500 text-xs">gols</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
