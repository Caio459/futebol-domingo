import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Target } from 'lucide-react'
import { supabase } from '../lib/supabase'

const medals = ['🥇', '🥈', '🥉']
const abas = ['Artilharia', 'Assistências', 'Combinado']

export default function Ranking() {
  const [aba, setAba] = useState(0)
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

  const ranked = jogadores.map(j => ({
    ...j,
    gols: eventos.filter(e => e.user_id === j.id && e.type === 'goal').length,
    assists: eventos.filter(e => e.user_id === j.id && e.type === 'assist').length,
  })).sort((a, b) => {
    if (aba === 0) return b.gols - a.gols
    if (aba === 1) return b.assists - a.assists
    return (b.gols + b.assists) - (a.gols + a.assists)
  })

  const getValue = (p) => {
    if (aba === 0) return { val: p.gols, label: 'gols' }
    if (aba === 1) return { val: p.assists, label: 'assists' }
    return { val: p.gols + p.assists, label: 'pts' }
  }

  const leader = ranked[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-4 pt-6">
      <div className="mb-6">
        <p className="text-gray-400 text-sm">Temporada 2025</p>
        <h1 className="text-white text-2xl font-bold">🏆 Ranking</h1>
      </div>

      {loading ? (
        <div className="bg-[#111827] rounded-2xl p-8 text-center text-gray-400">Carregando...</div>
      ) : leader && (
        <div className="bg-gradient-to-br from-[#1a5c2a] to-[#0a2e14] rounded-2xl p-5 mb-6 text-center border border-[#1a5c2a]">
          <div className="text-4xl mb-2">👑</div>
          <div className="text-5xl mb-2">{leader.avatar}</div>
          <h2 className="text-white text-xl font-bold">{leader.name}</h2>
          <p className="text-[#f5c518] text-3xl font-bold mt-1">{getValue(leader).val}</p>
          <p className="text-gray-300 text-sm">{getValue(leader).label} na temporada</p>
        </div>
      )}

      <div className="flex bg-[#111827] rounded-xl p-1 mb-6">
        {abas.map((a, i) => (
          <button key={a} onClick={() => setAba(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${aba === i ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ranked.map((p, i) => {
          const { val, label } = getValue(p)
          const isTop3 = i < 3
          return (
            <div key={p.id} className={`flex items-center gap-3 p-4 rounded-2xl border ${isTop3 ? 'bg-[#111827] border-[#1a5c2a]' : 'bg-[#0d1117] border-gray-800'}`}>
              <span className="text-xl w-8 text-center">{medals[i] || `${i+1}°`}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isTop3 ? 'bg-[#1a5c2a]/40' : 'bg-gray-800'}`}>{p.avatar}</div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${isTop3 ? 'text-white' : 'text-gray-300'}`}>{p.name}</p>
                <div className="flex gap-3 mt-0.5">
                  <span className="text-gray-500 text-xs flex items-center gap-1"><Target size={10} /> {p.gols} gols</span>
                  <span className="text-gray-500 text-xs flex items-center gap-1"><TrendingUp size={10} /> {p.assists} assists</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${isTop3 ? 'text-[#f5c518]' : 'text-gray-400'}`}>{val}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
