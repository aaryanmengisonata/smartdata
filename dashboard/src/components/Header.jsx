import React from 'react'
import { Bell, RefreshCw, Layers, Sun, Moon, User, Settings } from 'lucide-react'
import { useAppContext } from '../store/AppContext'

const pageTitles = {
  dashboard: { title: 'Dashboard', subtitle: 'Select a validation feature to begin' },
  test_cases: { title: 'Test Case Definition', subtitle: 'Define and manage CSV/Excel test skeletons' },
  run: { title: 'Execution Engine', subtitle: 'Trigger automated validations and stream terminal output' },
  reports: { title: 'Report Management', subtitle: 'Audit historical runs and compare results' },
  configuration: { title: 'Master Configuration', subtitle: 'Manage connection strings and environment variables' },
  logs: { title: 'Execution Details', subtitle: 'Real-time granular execution logs' },
}

export default function Header({ activePage }) {
  const { title, subtitle } = pageTitles[activePage] || pageTitles.dashboard
  const { setIsSettingsOpen, featureState } = useAppContext();

  const isWelcomePage = !featureState || featureState === 'intro';

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        {isWelcomePage && (
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-500/50 shadow-sm"
          >
            <Settings size={14} className="text-blue-500" />
            Settings
          </button>
        )}
      </div>
    </header>
  )
}
