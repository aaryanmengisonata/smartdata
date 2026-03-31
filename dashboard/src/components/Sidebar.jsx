import React from 'react'
import {
  LayoutDashboard,
  Play,
  FileText,
  Settings,
  ScrollText,
  FlaskConical,
  ChevronRight,
  Database,
  List
} from 'lucide-react'

const globalNav = [
  { id: 'configuration', label: 'Master Configuration', icon: Settings },
  { id: 'test_cases', label: 'Test Case Definition', icon: Database },
  { id: 'run', label: 'Execution Engine', icon: Play },
  { id: 'reports', label: 'Report Management', icon: FileText },
  { id: 'logs', label: 'Execution Details', icon: ScrollText },
]

export default function Sidebar({ activePage, setActivePage, featureState, setFeatureState }) {
  const isFeatureMode = ['fabric_audit'].includes(activePage)
  
  // Feature-specific local nav logic
  const getFeatureNav = () => {
    if (activePage === 'fabric_audit') {
      const navItems = []
      
      if (featureState === 'query' || featureState === 'portal' || !featureState) {
        navItems.push({ id: 'query', label: 'Query Mode', icon: List, action: () => setFeatureState('query') })
        navItems.push({ id: 'execution', label: 'Execution Mode', icon: Play, action: () => setFeatureState('execution') })
      } else if (featureState === 'execution') {
        navItems.push({ id: 'query', label: 'Query Mode', icon: List, action: () => setFeatureState('query') })
        navItems.push({ id: 'execution', label: 'Execution Mode', icon: Play, action: () => setFeatureState('execution') })
      }

      return navItems.filter(item => {
        if (featureState === 'query' && item.id === 'execution') return false
        if (featureState === 'execution' && item.id === 'query') return false
        return true
      })
    }
    return []
  }

  const items = isFeatureMode ? getFeatureNav() : globalNav

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div 
        onClick={() => setActivePage('dashboard')}
        className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 cursor-pointer hover:opacity-80 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <FlaskConical size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-black leading-tight uppercase tracking-tighter text-slate-900">Smart</p>
          <p className="text-[10px] font-bold leading-tight uppercase opacity-40 text-slate-400">Data</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {items.map((item) => {
          const { id, label, icon: Icon, action } = item
          const isActive = isFeatureMode ? (featureState === id) : (activePage === id)
          
          return (
            <button
              key={id}
              onClick={action ? action : () => setActivePage(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'opacity-40 group-hover:opacity-100'} />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} className="opacity-40" />}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-[9px] font-black uppercase tracking-widest text-center opacity-20">Sonata v2.4.1</p>
      </div>
    </aside>
  )
}
