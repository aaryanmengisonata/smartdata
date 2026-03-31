import React, { useState, useEffect } from 'react'
import { 
  Database, Layers, Globe, Settings, Save, Lock, Eye, EyeOff, 
  Loader2, CheckCircle, CloudUpload, Wifi, Info, ChevronLeft
} from 'lucide-react'
import { api } from '../services/api'

export default function Configuration({ navParams, setActivePage, setFeatureState }) {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('db')

  useEffect(() => {
    api.get('/api/config')
      .then(data => {
        setConfig(data); setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load config:", err);
        setLoading(false);
      });
      
    if (navParams?.targetTab) {
      setActiveTab(navParams.targetTab)
    }
  }, [navParams])

  const handleSave = async () => {
    setSaving(true)
    await api.post('/api/config', config)
    setSaving(false); setSaved(true); 
    setTimeout(() => {
      setSaved(false)
      setActivePage('fabric_audit')
    }, 1500)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target.result
        const imported = file.name.endsWith('.json') ? JSON.parse(content) : Object.fromEntries(content.split('\n').map(l => l.split('=')).filter(p => p.length === 2).map(([k, v]) => [k.trim().toUpperCase(), v.trim()]))
        setConfig(prev => ({ ...prev, ...imported }))
      } catch (err) { alert("Invalid file") }
    }
    reader.readAsText(file)
  }

  if (loading) return <div className="p-20 text-center uppercase tracking-widest animate-pulse">Loading Props...</div>

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Master Configuration
           </h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">
              {activeTab === 'fabric' ? 'Fabric Reconciliation Protocol' : 
               activeTab === 'db' ? 'Relational Database Gateway' :
               activeTab === 'api' ? 'REST Endpoint Sentry' : 'General Testing Metrics'}
           </p>
        </div>
        <button 
          onClick={() => {
            if (navParams?.returnPage) {
              if (navParams.returnMode && setFeatureState) setFeatureState(navParams.returnMode)
              setActivePage(navParams.returnPage)
            } else {
              setActivePage('dashboard')
            }
          }}
          className="p-3 rounded-full transition-all duration-300 bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center gap-2 pr-5"
          title="Back"
        >
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
      </div>

      {/* Tab Navigation (Moved to Top) */}
      <div className="flex items-center justify-center gap-10 py-2">
         {[ { id: 'db', label: 'Database' }, { id: 'fabric', label: 'Fabric' }, { id: 'api', label: 'API Gateway' }, { id: 'system', label: 'Runtime' } ].map(t => (
           <button 
             key={t.id} 
             onClick={() => setActiveTab(t.id)} 
             className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${
               activeTab === t.id 
                 ? 'text-blue-600 border-blue-600 opacity-100' 
                 : 'text-slate-400 border-transparent opacity-40 hover:opacity-100'
             }`}
           >
             {t.label}
           </button>
         ))}
      </div>

      <div className="border rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 bg-white border-slate-200 shadow-slate-200/50 text-slate-800">
        <div className="p-10">
           {activeTab === 'db' && <ConfigGrid title="Database Configuration" config={config} setConfig={setConfig} fields={[ {l: 'Type', k: 'DATABASE_DB_TYPE'}, {l: 'Host', k: 'DATABASE_DB_HOST'}, {l: 'DB Name', k: 'DATABASE_DB_NAME'}, {l: 'User', k: 'DATABASE_DB_USER'}, {l: 'Pass', k: 'DATABASE_DB_PASSWORD', s: true} ]} />}
           {activeTab === 'fabric' && <ConfigGrid title="Fabric Audit Parameters" config={config} setConfig={setConfig} fields={[ {l: 'Tenant ID', k: 'FABRIC_FABRIC_TENANT_ID'}, {l: 'Bronze Endpoint', k: 'FABRIC_BRONZE_BRONZE_SQL_ENDPOINT'}, {l: 'Silver Endpoint', k: 'FABRIC_SILVER_SILVER_SQL_ENDPOINT'} ]} />}
           {activeTab === 'api' && <ConfigGrid title="API Sentry Metrics" config={config} setConfig={setConfig} fields={[ {l: 'Base URL', k: 'API_API_BASE_URL'}, {l: 'Timeout', k: 'API_API_TIMEOUT'} ]} />}
           {activeTab === 'system' && <ConfigGrid title="Engine Runtime Specs" config={config} setConfig={setConfig} fields={[ {l: 'Max Workers', k: 'TESTING_MAX_WORKERS'}, {l: 'Report Dir', k: 'TESTING_REPORT_DIR'} ]} />}
        </div>

        {/* Action Bar */}
        <div className="p-8 border-t flex items-center justify-between px-10 bg-slate-50 border-slate-100">
           <div className="flex gap-4">
              <input type="file" id="import" className="hidden" onChange={handleImport} />
              <button 
                onClick={() => document.getElementById('import').click()} 
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors text-slate-400 hover:text-blue-600"
              >
                <CloudUpload size={14}/> Auto-Fill Logic
              </button>
           </div>

           <div className="flex items-center gap-6">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className={`relative px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 transform active:scale-95 shadow-xl ${
                  saving ? 'bg-slate-700 cursor-not-allowed' :
                  saved ? 'bg-emerald-600 shadow-emerald-500/20' : 
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Digitizing...</span>
                ) : (saved ? (
                  <span className="flex items-center gap-2"><CheckCircle size={12} /> Config Persisted</span>
                ) : 'Commit Changes')}
              </button>
           </div>
        </div>
      </div>

    </div>
  )
}

function ConfigGrid({ title, fields, config, setConfig }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
        <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {fields.map(f => (
          <div key={f.k} className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1 group-focus-within:opacity-100 transition-opacity">{f.l}</label>
            <input
              type={f.s ? 'password' : 'text'}
              value={config[f.k] || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, [f.k]: e.target.value }))}
              className="w-full p-2.5 rounded-lg border text-xs font-mono outline-none bg-white border-slate-200 text-slate-800 focus:border-blue-500/50 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
