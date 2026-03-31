import React from 'react'
import { useAppContext } from './store/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import RunTests from './pages/RunTests'
import Reports from './pages/Reports'
import Configuration from './pages/Configuration'
import Logs from './pages/Logs'
import TestCases from './pages/TestCases'
import FabricAudit from './pages/FabricAudit'
import Welcome from './pages/Welcome'

import Footer from './components/shared/Footer'

export default function App() {
  const { 
    activePage, setActivePage, 
    navParams, setNavParams, 
    featureState, setFeatureState 
  } = useAppContext()

  const pages = {
    dashboard: <Dashboard setActivePage={setActivePage} />,
    test_cases: <TestCases />,
    run: <RunTests />,
    reports: <Reports />,
    fabric_audit: <FabricAudit setActivePage={setActivePage} setNavParams={setNavParams} />,
    configuration: <Configuration navParams={navParams} setActivePage={setActivePage} />,
    logs: <Logs />,
    welcome: <Welcome />,
  }

  const currentPage = pages[activePage] || pages.dashboard

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-800">
      {!['dashboard', 'configuration', 'welcome'].includes(activePage) && (
        <Sidebar activePage={activePage} setActivePage={setActivePage} featureState={featureState} setFeatureState={setFeatureState} />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header activePage={activePage} />
        <main className={`flex-1 overflow-y-auto bg-white ${activePage === 'dashboard' ? 'p-0 pb-10' : (activePage === 'welcome' ? 'p-0 pb-10' : 'p-6 pb-16')}`}>
          {React.cloneElement(currentPage, { featureState, setFeatureState })}
        </main>
        {!['dashboard', 'configuration'].includes(activePage) && <Footer />}
      </div>
    </div>
  )
}
