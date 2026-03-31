import React from 'react'
import { Bell, RefreshCw, Layers, Sun, Moon, User } from 'lucide-react'

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

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </header>
  )
}
