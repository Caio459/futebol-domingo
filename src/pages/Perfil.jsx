import { useState } from 'react'
import { Trophy, Target, TrendingUp, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react'

const historico = [
  { data: '06 Abr', gols: 2, assists: 1, resultado: 'Vitória' },
  { data: '30 Mar', gols: 1, assists: 0, resultado: 'Empate' },
  { data: '23 Mar', gols: 0, assists: 2, resultado: 'Vitória' },
  { data: '16 Mar', gols: 3, assists: 0, resultado: 'Vitória' },
  { data: '09 Mar', gols: 0, assists: 1, resultado: 'Derrota' },
]

const pagamentos = [
  { mes: 'Abril 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Março 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Fevereiro 2025', status: 'pago', valor: 'R$ 80' },
  { mes: 'Janeiro 2025', status: 'pendente', valor: 'R$ 80' },
]

export default function Perfil() {
  const [aba, setAba] = useState(0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 pt-6 px-4">

      {/* Card do jogador */}
      <div className="bg-gradient-to-br from-[#1a5c2a] to-[#0a2e14] rounded-2xl p-6 mb-6 text-center border border-[#1a5c2a]">
        <div className="w-20 h-20 rounded-full bg-[#0a0a0a]/40 flex items-center justify-center text-5xl mx-auto mb-3">
          ⚡
        </div>
        <h1 className="text-white text-2xl font-bold">Marcel</h1>
        <p className="text-gray-300 text-sm mt-1">Meio-campista • #10</p>
        <span className="inline-block mt-2 bg-[#f5c518]/20 text-[#f5c518] text-xs font-bold px-3 py-1 rounded-full">
          MENSALISTA
        </span>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">9</p>
            <p className="text-gray-300 text-xs">Gols</p>
          </div>
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">8</p>
            <p className="text-gray-300 text-xs">Assists</p>
          </div>
          <div className="bg-[#0a0a0a]/40 rounded-xl p-3">
            <p className="text-[#f5c518] font-bold text-xl">12</p>
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

      {/* Histórico de partidas */}
      {aba === 0 && (
        <div className="space-y-3">
          {historico.map((jogo, i) => (
            <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-gray-800 flex items-center gap-4">
              <div className="text-center min-w-[48px]">
                <Calendar size={14} className="text-gray-500 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">{jogo.data}</p>
              </div>
              <div className="flex-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  jogo.resultado === 'Vitória' ? 'bg-green-500/20 text-green-400' :
                  jogo.resultado === 'Empate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{jogo.resultado}</span>
              </div>
              <div className="flex gap-4 text-right">
                <div className="flex items-center gap-1">
                  <Target size={13} className="text-[#1a5c2a]" />
                  <span className="text-white text-sm font-bold">{jogo.gols}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={13} className="text-[#f5c518]" />
                  <span className="text-white text-sm font-bold">{jogo.assists}</span>
                </div>
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
    </div>
  )
}
