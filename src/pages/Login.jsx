import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setErro('')
    setMsg('')

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) setErro('Email ou senha incorretos')

    } else {
      if (!nome.trim()) { setErro('Digite seu nome'); setLoading(false); return }

      const { data, error } = await supabase.auth.signUp({ email, password: senha })
      if (error) { setErro(error.message); setLoading(false); return }

      // Criar perfil na tabela users automaticamente
      if (data.user) {
        await supabase.from('users').upsert({
          name: nome.trim(),
          email: email.toLowerCase(),
          role: 'jogador',
          player_type: 'mensalista',
          avatar: '⚽',
          active: true,
        }, { onConflict: 'email' })
      }

      setMsg('Cadastro realizado! Entrando...')
    }
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
          <div className="flex bg-[#0a0a0a] rounded-xl p-1 mb-6">
            <button onClick={() => setModo('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'login' ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
              Entrar
            </button>
            <button onClick={() => setModo('cadastro')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${modo === 'cadastro' ? 'bg-[#1a5c2a] text-white' : 'text-gray-400'}`}>
              Cadastrar
            </button>
          </div>

          {erro && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm">{erro}</p>
            </div>
          )}

          {msg && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 mb-4">
              <p className="text-green-400 text-sm">{msg}</p>
            </div>
          )}

          <div className="space-y-3 mb-5">
            {modo === 'cadastro' && (
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Seu nome</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1a5c2a]" />
              </div>
            )}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1a5c2a]" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1a5c2a]" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !email || !senha}
            className="w-full bg-[#1a5c2a] text-white font-bold py-3 rounded-xl hover:bg-[#1f6d32] transition-all disabled:opacity-50">
            {loading ? 'Aguarde...' : modo === 'login' ? '⚽ Entrar' : '📝 Cadastrar'}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Apenas membros do grupo podem acessar
        </p>
      </div>
    </div>
  )
}
