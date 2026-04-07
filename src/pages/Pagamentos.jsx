import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, CreditCard, Users, TrendingUp } from 'lucide-react'

const jogadores = [
  { name: 'Carlos', avatar: '🇧🇷', tipo: 'mensalista', valor: 80, status: 'pago', data: '02/04' },
  { name: 'Marcel', avatar: '⚡', tipo: 'mensalista', valor: 80, status: 'pago', data: '01/04' },
  { name: 'João', avatar: '🔥', tipo: 'mensalista', valor: 80, status: 'pendente', data: null },
  { name: 'Pedro', avatar: '💪', tipo: 'mensalista', valor: 80, status: 'pendente', data: null },
  { name: 'Lucas', avatar: '🎯', tipo: 'avulso', valor: 30, status: 'pago', data: '06/04' },
  { name: 'Rafael', avatar: '⭐', tipo: 'mensalista', valor: 80, status: 'atrasado', data: null },
  { name: 'Bruno', avatar: '🦁', tipo: 'avulso', valor: 30, status: 'pago', data: '06/04' },
  { name: 'Diego', avatar: '🎪', tipo: 'mensalista', valor: 80, status: 'pendente', data: null },
]

const statusConfig = {
  pago: { label: 'PAGO', icon: CheckCircle, bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  pendente: { label: 'PENDENTE', icon: Clock, bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  atrasado: { label: 'ATRASADO', icon: AlertCircle, bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
}

export default function Pagamentos() {
  const [filtro, setFiltro] = useState('todos')

  const pagos = jogadores.filter(j => j.status === 'pago')
  const pendentes = jogadores.filter(j => j.status !== 'pago')
  const totalEsperado = jogadores.filter(j => j.tipo === 'mensalista').reduce((a, j) => a + j.valor, 0)
  const totalRecebido = jogadores.filter(j => j.status === 'pago').reduce((a, j) => a + j.valor, 0)
  const pct = Math.round((totalRecebido / totalEsperado) * 100)

  const filtrados = filtro === 'todos' ? jogadores
    : filtro === 'pendente' ? jogadores.filter(j => j.status !== 'pago')
    : jogadores.filter(j => j.status === 'pago')

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-4 pt-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm">Admin • Abril 2025</p>
        <h1 className="text-white text-2xl font-bold">💰 Pagamentos</h1>
      </div>

      {/* Resumo financeiro */}
      <div className="bg-gradient-to-br from-[#1a5c2a] to-[#0a2e14] rounded-2xl p-5 mb-5 border border-[#1a5c2a]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-300 text-sm">Total Recebido</p>
            <p className="text-white text-3xl font-bold">R$ {totalRecebido}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Meta</p>
            <p className="text-gray-200 text-xl font-bold">R$ {totalEsperado}</p>
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="bg-[#0a0a0a]/40 rounded-full h-3 mb-2">
          <div className="bg-[#f5c518] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300 text-xs">{pagos.length} de {jogadores.length} pagaram</span>
          <span className="text-[#f5c518] text-xs font-bold">{pct}%</span>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#111827] rounded-2xl p-3 text-center border border-gray-800">
          <CheckCircle size={18} className="text-green-400 mx-auto mb-1" />
          <p className="text-white font-bold">{pagos.length}</p>
          <p className="text-gray-400 text-xs">Pagos</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-3 text-center border border-gray-800">
          <Clock size={18} className="text-yellow-400 mx-auto mb-1" />
          <p className="text-white font-bold">{jogadores.filter(j=>j.status==='pendente').length}</p>
          <p className="text-gray-400 text-xs">Pendentes</p>
        </div>
        <div className="bg-[#111827] rounded-2xl p-3 text-center border border-gray-800">
          <AlertCircle size={18} className="text-red-400 mx-auto mb-1" />
          <p className="text-white font-bold">{jogadores.filter(j=>j.status==='atrasado').length}</p>
          <p className="text-gray-400 text-xs">Atrasados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex bg-[#111827] rounded-xl p-1 mb-5">
        {[['todos','Todos'],['pendente','Pendentes'],['pago','Pagos']].map(([val, label]) => (
          <button key={val} onClick={() => setFiltro(val)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${filtro === val ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lista de jogadores */}
      <div className="space-y-3">
        {filtrados.map((jogador, i) => {
          const cfg = statusConfig[jogador.status]
          const Icon = cfg.icon
          return (
            <div key={i} className={`bg-[#111827] rounded-2xl p-4 border ${cfg.border} flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-full bg-[#1a5c2a]/30 flex items-center justify-center text-xl">
                {jogador.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">{jogador.name}</p>
                  {jogador.tipo === 'avulso' && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">AVULSO</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  R$ {jogador.valor} {jogador.data ? `• Pago em ${jogador.data}` : '• Aguardando pagamento'}
                </p>
              </div>
              <span className={`flex items-center gap-1 ${cfg.bg} ${cfg.text} text-xs font-bold px-3 py-1.5 rounded-full`}>
                <Icon size={11} /> {cfg.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
