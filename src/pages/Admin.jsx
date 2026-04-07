import { useState, useEffect } from 'react'
import { Users, Trophy, Calendar, Settings, ChevronRight, ToggleLeft, ToggleRight, Plus, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

const partidas = [
  { data: '06 Abr', placar: '5x3', jogadores: 12 },
  { data: '30 Mar', placar: '4x4', jogadores: 10 },
  { data: '23 Mar', placar: '6x2', jogadores: 14 },
]

export default function Admin() {
  const [aba, setAba] = useState(0)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('users').select('*').order('name')
      setPlayers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const toggleAtivo = async (id, currentStatus) => {
    await supabase.from('users').update({ active: !currentStatus }).eq('id', id)
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-4 pt-6">
      <div className="mb-6">
        <p className="text-gray-400 text-sm">Temporada 2025</p>
        <h1 className="text-white text-2xl font-bold">⚙️ Painel Admin</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#111827] rounded-2xl p-4 border border-[#1a5c2a]">
          <Users size={20} className="text-[#1a5c2a] mb-2" />
          <p className="text-white font-bold text-2xl">{players.filter(p=>p.active).length}</p>
          <p className="text-gray-400 text-xs">Jogadores ativos</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 border border-gray-800">
          <Trophy size={20} className="text-[#f5c518] mb-2" />
          <p className="text-white font-bold text-2xl">{partidas.length}</p>
          <p className="text-gray-400 text-xs">Partidas na temporada</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 border border-gray-800">
          <Calendar size={20} className="text-blue-400 mb-2" />
          <p className="text-white font-bold text-sm">13 Abr</p>
          <p className="text-gray-400 text-xs">Próximo jogo</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-4 border border-gray-800">
          <Shield size={20} className="text-purple-400 mb-2" />
          <p className="text-white font-bold text-sm">2025</p>
          <p className="text-gray-400 text-xs">Temporada ativa</p>
        </div>
      </div>

      <div className="flex bg-[#111827] rounded-xl p-1 mb-5">
        {['Jogadores', 'Partidas', 'Config'].map((a, i) => (
          <button key={a} onClick={() => setAba(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${aba === i ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
            {a}
          </button>
        ))}
      </div>

      {aba === 0 && (
        <div className="space-y-3">
          <button className="w-full bg-[#1a5c2a]/20 border border-[#1a5c2a] border-dashed rounded-2xl p-4 flex items-center justify-center gap-2 text-[#1a5c2a] font-semibold">
            <Plus size={18} /> Adicionar Jogador
          </button>
          {loading ? (
            <p className="text-gray-400 text-center py-4">Carregando...</p>
          ) : players.map((p) => (
            <div key={p.id} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a5c2a]/20 flex items-center justify-center text-xl">{p.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  {p.role === 'admin' && <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">ADMIN</span>}
                  {p.player_type === 'avulso' && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">AVULSO</span>}
                </div>
                <p className={`text-xs mt-0.5 ${p.active ? 'text-green-400' : 'text-gray-500'}`}>{p.active ? '● Ativo' : '○ Inativo'}</p>
              </div>
              <button onClick={() => toggleAtivo(p.id, p.active)}>
                {p.active ? <ToggleRight size={28} className="text-[#1a5c2a]" /> : <ToggleLeft size={28} className="text-gray-600" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {aba === 1 && (
        <div className="space-y-3">
          <button className="w-full bg-[#1a5c2a]/20 border border-[#1a5c2a] border-dashed rounded-2xl p-4 flex items-center justify-center gap-2 text-[#1a5c2a] font-semibold">
            <Plus size={18} /> Registrar Nova Partida
          </button>
          {partidas.map((p, i) => (
            <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center gap-4">
              <div className="text-center min-w-[52px]">
                <Calendar size={14} className="text-gray-500 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">{p.data}</p>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">{p.placar}</p>
                <p className="text-gray-400 text-xs">{p.jogadores} jogadores</p>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </div>
          ))}
        </div>
      )}

      {aba === 2 && (
        <div className="space-y-3">
          {[
            { label: 'Nome do Grupo', value: 'Futebol de Domingo', icon: Settings },
            { label: 'Dia do Jogo', value: 'Todo Domingo', icon: Calendar },
            { label: 'Quadra', value: 'Arena Society SP', icon: Shield },
            { label: 'Horário', value: '08:00', icon: Trophy },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a5c2a]/20 flex items-center justify-center">
                <Icon size={16} className="text-[#1a5c2a]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </div>
          ))}
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <p className="text-red-400 font-semibold text-sm mb-1">⚠️ Zona de Perigo</p>
            <p className="text-gray-400 text-xs mb-3">Encerrar a temporada atual e iniciar uma nova.</p>
            <button className="w-full bg-red-500/20 text-red-400 font-semibold py-2 rounded-xl text-sm border border-red-500/30">
              Encerrar Temporada 2025
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
