import React, { useState, useEffect } from 'react'
import { 
  Play, Settings, Send, 
  FileText, ChevronRight,
  Sparkles, MessageSquare, Cpu,
  CloudUpload, ArrowRight, Zap,
  Database, RefreshCw, Activity,
  Terminal as TerminalIcon, PlusCircle,
  Undo2, AlertCircle, CheckCircle as CheckCircleIcon,
  ChevronDown
} from 'lucide-react'
import Terminal from '../components/shared/Terminal'

export default function FabricAudit({ setActivePage, setNavParams, featureState, setFeatureState }) {
  // Shared State
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [showLogs, setShowLogs] = useState(false)
  
  // Query Mode State
  const [prompt, setPrompt] = useState('')
  const [queryBuffer, setQueryBuffer] = useState('')
  const [isLlmLoading, setIsLlmLoading] = useState(false)

  // Execution Mode State
  const [selectedDataset, setSelectedDataset] = useState('bronze_silver')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [reportData, setReportData] = useState(null)

  const currentMode = (featureState === 'workspace' || !featureState || featureState === 'query') ? 'query' : featureState

  // --- LLM LOGIC ---
  const handleGenerateQuery = () => {
    if (!prompt.trim()) return
    setIsLlmLoading(true)
    
    // Simulate LLM delay
    setTimeout(() => {
      let result = ""
      if (!queryBuffer.trim()) {
        result = `-- Generated SQL for: ${prompt}\nSELECT \n  source.id, \n  source.value, \n  target.value \nFROM fabric.bronze_layer AS source\nJOIN fabric.silver_layer AS target ON source.id = target.id\nWHERE source.is_active = 1;`
      } else {
        result = `-- Improved Query based on: ${prompt}\n${queryBuffer}\n-- Optimization: Added index hint and schema mapping for Fabric Lakehouse.`
      }
      setQueryBuffer(result)
      setIsLlmLoading(false)
    }, 1500)
  }

  // --- EFFECT: LIVE LOG STREAM ---
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString()
        const newLogs = [
          `[${timestamp}] SCANNING partition_id=delta_${Math.floor(Math.random() * 1000)}`,
          `[${timestamp}] COMPARING record_offsets ${Math.floor(Math.random() * 5000)}..${Math.floor(Math.random() * 10000)}`,
          `[${timestamp}] STATUS: Processing batch through Neural Bridge...`
        ]
        setLogs(prev => [...prev.slice(-20), ...newLogs])
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const toggleExecution = () => {
    const newRunningState = !isRunning
    setIsRunning(newRunningState)
    if (newRunningState) {
      setIsComplete(false)
      setLogs([
        "[SYSTEM] Initializing Fabric Audit Engine...",
        `[INFO] Target Dataset: ${selectedDataset.toUpperCase()}`,
        uploadedFile ? `[INFO] Source: ${uploadedFile.name}` : "[INFO] Source: Default Lakehouse Catalog",
        "[PROCESS] Loading reconciliation logic...",
        "[INFO] Validating schema consistency...",
        "[PROCESS] Execution started. Scanning for delta logs..."
      ])

      // Simulate completion after 8 seconds
      setTimeout(() => {
        setIsRunning(false)
        setIsComplete(true)
        setReportData({
          totalRows: 12450,
          matches: 12432,
          mismatches: 18,
          accuracy: 99.85,
          mismatchDetails: [
            { id: 'REC_8842', field: 'unit_price', source: '24.50', target: '24.48', risk: 'High' },
            { id: 'REC_9011', field: 'tax_amount', source: '2.10', target: 'NULL', risk: 'Critical' },
            { id: 'REC_9055', field: 'currency_code', source: 'USD', target: 'EUR', risk: 'Medium' }
          ]
        })
      }, 8000)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      setLogs(prev => [`[INFO] File recognized: ${file.name}`, ...prev])
    }
  }

  const openSettings = () => {
    setNavParams({ targetTab: 'fabric', returnPage: 'fabric_audit', returnMode: 'query' })
    setActivePage('configuration')
  }

  const handleExport = () => {
    if (!reportData) return
    const csvContent = "Record ID,Field,Source,Target,Risk\n" + 
      reportData.mismatchDetails.map(m => `${m.id},${m.field},${m.source},${m.target},${m.risk}`).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Fabric_Audit_${selectedDataset}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

 
  // --- RENDER QUERY MODE ---
  if (currentMode === 'query') {
    return (
      <div className="h-full flex flex-col animate-in fade-in duration-700 p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center border border-purple-500/20 shadow-sm">
                <Sparkles className="text-purple-600" size={20} />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tight uppercase">Query Builder</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">AI-Powered Logic Generation</p>
             </div>
          </div>
          <div className="flex gap-3">
            <button 
                onClick={() => setFeatureState('execution')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-500/50"
            >
                Execution Mode <ArrowRight size={14} className="text-emerald-500" />
            </button>
            <button 
                onClick={openSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-500/50"
            >
                <Settings size={14} className="text-blue-500" /> Settings
            </button>
          </div>
        </div>

        {/* Fabric Validation Welcome Card */}
        <div className="px-4 mb-6 shrink-0">
           <div className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
               <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
               
               <div className="relative z-10 flex gap-6 items-center">
                   <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                       <Sparkles size={32} className="text-white drop-shadow-md" />
                   </div>
                   <div>
                       <h2 className="text-xl font-black mb-1 tracking-tight shadow-sm">Fabric Validation Engine</h2>
                       <p className="text-[11px] font-bold text-blue-100 max-w-2xl leading-relaxed">
                           Welcome to the high-performance AI-driven validation core. Construct intelligent queries or seamlessly execute large-scale data reconciliations across Bronze, Silver, and Gold delta layers right from this workspace.
                       </p>
                   </div>
               </div>
               
               <div className="relative z-10 hidden lg:flex flex-col items-end">
                   <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest text-emerald-100 backdrop-blur-sm mb-2 shadow-sm">
                      System Online
                   </span>
                   <span className="text-[10px] uppercase font-bold text-blue-200 tracking-widest opacity-80">
                      Query Mode
                   </span>
               </div>
           </div>
        </div>

        {/* Primary Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pb-4 overflow-hidden">
           {/* Section 1: Requirement Prompt */}
           <div className="flex flex-col rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all bg-white border-slate-200">
              <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-500/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <MessageSquare size={14} className="text-purple-500" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Requirement Prompt</span>
                 </div>
              </div>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Generate a SQL query to compare row counts between Bronze and Silver layers for the 'Orders' table..."
                className="flex-1 p-10 bg-transparent outline-none resize-none text-base font-medium leading-relaxed placeholder:opacity-20 text-slate-800"
              />
              <div className="p-8 border-t border-dashed border-slate-500/10">
                 <button 
                   onClick={handleGenerateQuery}
                   disabled={isLlmLoading || !prompt.trim()}
                   className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-purple-500/30 active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale"
                 >
                   {isLlmLoading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} className="fill-white/20" />}
                   {isLlmLoading ? 'Processing Intelligence...' : 'Generate / Fix Query'}
                 </button>
              </div>
           </div>

           {/* Section 2: Query Result / Buffer */}
           <div className="flex flex-col rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all bg-slate-50 border-slate-200 shadow-inner">
              <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-500/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Cpu size={14} className="text-emerald-500" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Logic Workspace</span>
                 </div>
              </div>
              <textarea 
                value={queryBuffer}
                onChange={(e) => setQueryBuffer(e.target.value)}
                placeholder="The generated query will appear here. You can also paste your own query for the AI to fix."
                className="flex-1 p-10 bg-transparent outline-none resize-none text-xs font-mono leading-relaxed placeholder:opacity-20 text-slate-600"
              />
              <div className="p-8 border-t border-dashed border-slate-500/10 flex items-center justify-between">
                 <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 italic">
                   Note: Output acts as input for correction cycle
                 </p>
                 <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 transition-all opacity-40 hover:opacity-100">
                      <Undo2 size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    )
  }

  // --- RENDER EXECUTION MODE ---
  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-700 bg-slate-500/5 rounded-[2rem] overflow-hidden">
       {/* Top Status & Mode Bar */}
       <div className="flex items-center justify-between px-8 py-4 border-b transition-colors border-slate-100 bg-white/40">
          <div className="flex items-center gap-4">
             <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse outline outline-4 outline-emerald-500/20' : 'bg-slate-400 opacity-40'}`} />
             <div className="flex flex-col">
                <h1 className="text-xs font-black uppercase tracking-widest opacity-80">
                  System Runtime <span className="mx-2 opacity-20">|</span> 
                  <span className={isRunning ? 'text-emerald-500' : ''}>{isRunning ? 'Active Engine' : 'Engine Idle'}</span>
                </h1>
             </div>
          </div>
          <button 
              onClick={() => setFeatureState('query')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-500/50 shadow-sm"
          >
              <Undo2 size={12} className="text-purple-500" /> Return to Query Mode
          </button>
       </div>

       {/* Unified Control Strip */}
       <div className="px-8 py-6 border-b flex flex-wrap items-center gap-10 transition-colors border-slate-50">
          {/* Dataset Selection */}
          <div className="flex flex-col gap-2 min-w-[200px]">
             <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Dataset Selection</label>
             <div className="relative">
                <select 
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full appearance-none bg-transparent border-b-2 py-1 text-[11px] font-black outline-none transition-all border-slate-100 text-slate-700 focus:border-blue-500/30"
                >
                  <option value="bronze_silver">Bronze to Silver Layer</option>
                  <option value="silver_gold">Silver to Gold Layer</option>
                  <option value="custom">Custom Configuration</option>
                </select>
                <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 opacity-40" size={12} />
             </div>
          </div>

          {/* File Intake */}
          <div className="flex flex-col gap-2 min-w-[200px]">
             <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">File Intake Source</label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-slate-100 group-hover:bg-blue-100">
                   <CloudUpload size={14} className={uploadedFile ? "text-emerald-500" : "text-blue-500"} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    {uploadedFile ? uploadedFile.name : 'Import CSV Library'}
                  </span>
                  {uploadedFile && <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">Ready for transmission</span>}
                </div>
             </label>
          </div>

          {/* Quick Metrics (Subtle) */}
          <div className="flex flex-1 items-center justify-center gap-12 border-x border-dashed border-slate-500/10 px-10">
              <div className="text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Health</p>
                 <p className="text-xs font-black text-emerald-500">99.8%</p>
              </div>
              <div className="text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Latency</p>
                 <p className="text-xs font-black">24ms</p>
              </div>
              <div className="text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Threads</p>
                 <p className="text-xs font-black">12/16</p>
              </div>
          </div>

          {/* Master Action */}
          <button 
            onClick={toggleExecution}
            className={`group relative h-12 px-10 rounded-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl ${
              isRunning 
              ? 'bg-rose-500 text-white shadow-rose-500/20' 
              : 'bg-emerald-600 text-white shadow-emerald-500/30'
            }`}
          >
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isRunning ? 'Terminate' : 'Start Transmission'}</span>
             {isRunning ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} className="fill-white/20" />}
          </button>
       </div>

       {/* Integrated Monitoring Desk */}
       <div className="flex-1 overflow-hidden relative group">
          <div className="h-full flex flex-col">
             {/* Dynamic Header */}
             <div className="px-8 py-3 flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40 bg-slate-50/50">
                <span>Telemetry Tracer Console</span>
                <span className="flex items-center gap-1.5"><Activity size={10} className="animate-pulse text-blue-500" /> Live Data Stream</span>
             </div>
             
             {isComplete && reportData ? (
                <div className="flex-1 overflow-y-auto px-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   {/* Report Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-6 rounded-3xl border bg-white border-slate-100 shadow-sm">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Accuracy Score</p>
                         <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-emerald-500">{reportData.accuracy}%</span>
                            <span className="text-[10px] font-bold opacity-30 pb-1">/ 100%</span>
                         </div>
                      </div>
                      <div className="p-6 rounded-3xl border bg-white border-slate-100 shadow-sm">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Match Rate</p>
                         <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-blue-500">{reportData.matches}</span>
                            <span className="text-[10px] font-bold opacity-30 pb-1">Matches Found</span>
                         </div>
                      </div>
                      <div className="p-6 rounded-3xl border bg-white border-slate-100 shadow-sm">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Discrepancy Count</p>
                         <div className="flex items-end gap-2">
                            <span className={`text-3xl font-black ${reportData.mismatches > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                               {reportData.mismatches}
                            </span>
                            <span className="text-[10px] font-bold opacity-30 pb-1">Action Required</span>
                         </div>
                      </div>
                   </div>

                   {/* Mismatch Table */}
                   <div className="rounded-3xl border overflow-hidden bg-white border-slate-100 shadow-lg">
                      <div className="px-6 py-4 border-b border-dashed border-slate-500/10 flex items-center justify-between">
                         <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Variance Analysis Log</h3>
                         <button onClick={handleExport} className="text-[8px] font-black uppercase tracking-widest text-blue-500 hover:underline">Export Detailed Report (CSV)</button>
                      </div>
                      <table className="w-full text-left">
                         <thead>
                            <tr className="text-[8px] font-black uppercase tracking-widest opacity-30 border-b border-slate-500/5">
                               <th className="px-6 py-4">Record ID</th>
                               <th className="px-6 py-4">Field</th>
                               <th className="px-6 py-4">Source</th>
                               <th className="px-6 py-4">Target</th>
                               <th className="px-6 py-4 text-right">Risk</th>
                            </tr>
                         </thead>
                         <tbody className="text-[10px] font-medium leading-relaxed">
                            {reportData.mismatchDetails.map((m, i) => (
                               <tr key={i} className={`group hover:bg-slate-500/5 transition-colors border-b border-slate-500/5 last:border-0`}>
                                  <td className="px-6 py-4 font-black">{m.id}</td>
                                  <td className="px-6 py-4 opacity-70 uppercase tracking-tighter">{m.field}</td>
                                  <td className="px-6 py-4 text-emerald-500 font-bold">{m.source}</td>
                                  <td className="px-6 py-4 text-rose-500 font-bold">{m.target}</td>
                                  <td className="px-6 py-4 text-right">
                                     <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter ${
                                        m.risk === 'Critical' ? 'bg-rose-500/20 text-rose-500' : 
                                        m.risk === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                                     }`}>{m.risk}</span>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             ) : (isRunning || showLogs ? (
                <div className="flex-1 opacity-90">
                   <Terminal logs={logs} minHeight="100%" />
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 transition-all">
                   <Cpu size={60} className="opacity-5 mb-6 transition-transform duration-1000 group-hover:scale-110 text-slate-900" />
                   <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-10">Neural Interface Standby</p>
                </div>
             ))}
          </div>

          <button 
             onClick={() => setShowLogs(!showLogs)}
             className={`absolute top-10 right-8 w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-2xl z-10 ${
               showLogs 
                 ? 'bg-blue-600 text-white border-blue-500' 
                 : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
             }`}
          >
             <TerminalIcon size={14} />
          </button>
       </div>
    </div>
  )
}
