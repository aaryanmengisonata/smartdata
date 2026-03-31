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
        {!isFeatureMode ? (
          globalNav.map((item) => {
            const { id, label, icon: Icon } = item
            const isActive = activePage === id
            
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
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
          })
        ) : (
          <FeatureToggle featureState={featureState} setFeatureState={setFeatureState} />
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-[9px] font-black uppercase tracking-widest text-center opacity-20">Sonata v2.4.1</p>
      </div>
    </aside>
  )
}

function FeatureToggle({ featureState, setFeatureState }) {
  const isQuery = featureState === 'query' || !featureState;
  
  // The button indicates the TARGET mode (the alternate option)
  const targetMode = isQuery ? 'execution' : 'query';
  const label = isQuery ? 'Execution Mode' : 'Query Mode';
  const Icon = isQuery ? Play : List;

  return (
    <div className="relative group perspective-1000">
      <button
        onClick={() => setFeatureState(targetMode)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-500 group overflow-hidden relative isolate"
      >
        {/* Animated Background Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-0 bg-white/10 group-hover:h-full transition-all duration-500 -z-10" />
        
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
          {/* We use a key trick here to re-animate the text completely when the label changes */}
          <span key={label} className="text-xs font-black uppercase tracking-widest animate-in slide-in-from-bottom-2 fade-in duration-300">
            {label}
          </span>
        </div>
        <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </button>
      
      {/* Small subtle help text underneath */}
      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center mt-3 opacity-60">
        Currently in <span className="text-blue-500">{isQuery ? 'Query' : 'Execution'} Mode</span>
      </p>
    </div>
  )
}
