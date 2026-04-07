import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Trophy, Target, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'

const filtros = ['Mês', 'Trimestre', 'Temporada']

export default function Scouts() {
  const [jogadores, setJogadores] = useState([])
  const [eventos, setEventos] = useState([])
  const [partidas, setPartidas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: users } = await supabase.from('users').select('*').eq('active', true)
      const { data: events } = await supabase.from('match_events').select('*')
      const { data: matches } = await supabase.from('matches').select('*')
      setJogadores(users || [])
      setEventos(events || [])
      setPartidas(matches || [])
      setLoading(false)
    }
    load()
  }, [])

  const gols = eventos.filter(e => e.type === 'goal').length
  const assists = eventos.filter(e => e.type === 'assist').length
  const media = partidas.length > 0 ? (gols / partidas.length).toFixed(1) : 0

  const artilheiros = jogadores.map(j => ({
    name: j.name,
    gols: eventos.filter(e => e.user_id === j.id && e.type === 'goal').length
  })).sort((a, b) => b.gols - a.gols).slice(0, 5)

  const golsPorMes = [
    { mes: 'Jan', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 0).length },
    { mes: 'Fev', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 1).length },
    { mes: 'Mar', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 2).length },
    { mes: 'Abr', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 3).length },
    { mes: 'Mai', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 4).length },
    { mes: 'Jun', gols: eventos.filter(e => e.type === 'goal' && new Date(e.created_at).getMonth() === 5).length },
  ]

  const participacao = [
    { name: 'Gols', value: gols || 1, color: '#1a5c2a' },
    { name: 'Assistências', value: assists || 1, color: '#f5c518' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-4 pt-6">
      <div className="mb-6">
        <p className="text-gray-400 text-sm">Temporada 2025</p>
        <h1 className="text-white text-2xl font-bold">📊 Scouts</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {filtros.map((f, i) => (
          <button key={f} className={`px-4 py-2 rounded-full text-sm font-semibold ${i === 2 ? 'bg-[#1a5c2a] text-white' : 'bg-[#111827] text-gray-400'}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <Target size={18} className="text-[#1a5c2a] mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : gols}</p>
          <p className="text-gray-400 text-xs">Gols</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <TrendingUp size={18} className="text-[#f5c518] mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : assists}</p>
          <p className="text-gray-400 text-xs">Assists</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 text-center border border-gray-800">
          <Trophy size={18} className="text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold text-xl">{loading ? '...' : media}</p>
          <p className="text-gray-400 text-xs">Média/jogo</p>
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl p-4 mb-4 border border-gray-800">
        <h2 className="text-white font-bold mb-4">📈 Evolução de Gols</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={golsPorMes}>
            <XAxis dataKey="mes" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1a5c2a', borderRadius: 8, color: '#fff' }} />
            <Line type="monotone" dataKey="gols" stroke="#1a5c2a" strokeWidth={3} dot={{ fill: '#f5c518', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#111827] rounded-2xl p-4 mb-4 border border-gray-800">
        <h2 className="text-white font-bold mb-4">🏆 Ranking Artilheiros</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={artilheiros} layout="vertical">
            <XAxis type="number" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} width={50} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1a5c2a', borderRadius: 8, color: '#fff' }} />
            <Bar dataKey="gols" fill="#1a5c2a" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#111827] rounded-2xl p-4 border border-gray-800">
        <h2 className="text-white font-bold mb-4">🎯 Gols vs Assistências</h2>
        <div className="flex items-center justify-between">
          <ResponsiveContainer width="50%" height={150}>
            <PieChart>
              <Pie data={participacao} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                {participacao.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1a5c2a', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 pl-4 space-y-3">
            {participacao.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <div>
                  <p className="text-white text-sm font-semibold">{gols === 0 && assists === 0 ? 0 : item.value}</p>
                  <p className="text-gray-400 text-xs">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
