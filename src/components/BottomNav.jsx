import { Home, BarChart2, Trophy, User, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const tabs = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: BarChart2, label: 'Scouts', path: '/scouts' },
  { icon: Trophy, label: 'Ranking', path: '/ranking' },
  { icon: User, label: 'Perfil', path: '/perfil' },
]

const adminTab = { icon: Settings, label: 'Admin', path: '/admin' }

export default function BottomNav({ current, onChange }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single()
        setIsAdmin(data?.role === 'admin')
      }
    }
    checkAdmin()
  }, [])

  const visibleTabs = isAdmin ? [...tabs, adminTab] : tabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1a5c2a] flex justify-around items-center h-16 z-50" style={{ maxWidth: 480, margin: '0 auto', left: '50%', transform: 'translateX(-50%)' }}>
      {visibleTabs.map(({ icon: Icon, label, path }) => {
        const active = current === path
        return (
          <button key={path} onClick={() => onChange(path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${active ? 'text-[#f5c518]' : 'text-gray-500'}`}>
            <Icon size={22} />
            <span className="text-xs">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
