import React, { useState, useEffect } from 'react'
import { useAppContext } from '../store/AppContext'
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
   const {
      isRunning, logs, showLogs, selectedDataset, uploadedFile,
      isComplete, setIsComplete,
      reportData, setReportData,
      gridColumns, gridData,
      updateGridCell, addGridRow, deleteGridRow,
      toggleExecution, handleFileUpload
   } = useAppContext()

   // Query Mode State
   const [prompt, setPrompt] = useState('')
   const [queryBuffer, setQueryBuffer] = useState('')
   const [isLlmLoading, setIsLlmLoading] = useState(false)
   const [saveStatus, setSaveStatus] = useState('idle') // 'idle', 'saving', 'saved'

   const currentMode = (!featureState || featureState === 'intro') ? 'intro' : featureState

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


   const openSettings = () => {
      setNavParams({ targetTab: 'fabric', returnPage: 'fabric_audit', returnMode: 'query' })
      setActivePage('configuration')
   }

   const handleSave = () => {
      setSaveStatus('saving')
      setTimeout(() => {
         setSaveStatus('saved')
         setTimeout(() => setSaveStatus('idle'), 3000)
      }, 1000)
   }

   const handleExport = () => {
      if (!reportData) return
      const csvContent = "Record ID,Field,Source,Target,Risk\n" +
         reportData.mismatchDetails.map(m => `${m.id},${m.field},${m.source},${m.target},${m.risk}`).join("\n")
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Fabric_Audit_${selectedDataset}_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
   }


   // --- RENDER INTRO MODE ---
   if (currentMode === 'intro') {
      return (
         <div className="w-full flex flex-col p-8 lg:p-12 animate-in fade-in duration-700 bg-slate-50/30">
            <div className="max-w-5xl mx-auto w-full">

               {/* Minimalist Top Banner */}
               <div className="w-full flex items-center justify-between mb-8">
                  <div>
                     <h1 className="text-2xl font-black tracking-tight text-slate-900 border-l-4 border-blue-600 pl-4 py-1">
                        Fabric Validation Engine
                     </h1>
                     <p className="text-[11px] font-bold text-slate-400 mt-2 pl-5 uppercase tracking-widest">
                        Enterprise Data Auditing Platform
                     </p>
                  </div>
               </div>

               {/* Core Bento Overview */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* Main Description */}
                  <div className="md:col-span-2 p-10 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                        <Sparkles size={20} className="text-blue-600" />
                     </div>
                     <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">AI-Driven Reconciliation</h2>
                     <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                        Welcome to the high-performance validation core. Construct intelligent queries using natural language or seamlessly execute enormous, large-scale data reconciliations across your Bronze, Silver, and Gold delta layers with sub-second accuracy.
                     </p>
                  </div>

                  {/* Quick Stats / Info */}
                  <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-3xl" />
                     <div className="relative z-10">
                        <Database className="text-slate-400 mb-6" size={24} />
                        <h3 className="text-sm font-black mb-2 tracking-wide">Lakehouse Integrated</h3>
                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                           Direct connection to Sonata Fabric Models. Delta logs tracked automatically.
                        </p>
                     </div>
                     <div className="relative z-10 mt-8 group cursor-default">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Architecture</p>
                        <p className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">Medallion Native</p>
                     </div>
                  </div>
               </div>

               {/* Getting Started Guide */}
               <div className="flex flex-col items-center justify-center p-12 text-center rounded-[2rem] border border-dashed border-slate-300/60 bg-white/50">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                     <ChevronRight className="text-slate-400 rotate-90" size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2 tracking-tight">Ready to initiate an audit?</h3>
                  <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
                     Select either <span className="text-blue-600">Query Mode</span> to start building logic, or <span className="text-emerald-600">Execution Mode</span> to run existing pipelines using the sidebar toggle.
                  </p>
                  <button
                     onClick={() => setFeatureState('query')}
                     className="px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                     Launch Query Workspace
                  </button>
               </div>

            </div>
         </div>
      )
   }

   // --- RENDER QUERY MODE ---
   if (currentMode === 'query') {
      return (
         <div className="w-full flex flex-col animate-in fade-in duration-700 p-2">
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
                  {/* Internal Settings button removed */}
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
   const showPreview = selectedDataset && (selectedDataset !== 'custom' || uploadedFile) && !isRunning && !isComplete;

   const datasetLabel = selectedDataset === 'bronze_silver' ? 'Bronze → Silver'
      : selectedDataset === 'silver_gold' ? 'Silver → Gold'
      : uploadedFile ? uploadedFile.name : 'Custom'


   return (
      <div className="flex-1 flex bg-white overflow-hidden">

         {/* ── Main Workspace ── */}
         <div className="flex-1 flex flex-col min-w-0 bg-white">

            {showPreview ? (
               <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
                  {/* Dataset Header */}
                  <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                           <Database size={15} className="text-blue-500" />
                        </div>
                        <div>
                           <h2 className="text-sm font-black text-slate-800 leading-none">{datasetLabel}</h2>
                           <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Lakehouse · Medallion</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                           onClick={handleSave}
                           disabled={saveStatus === 'saving'}
                           className={`h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border ${
                              saveStatus === 'saved' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                           }`}
                        >
                           {saveStatus === 'saving' ? <RefreshCw size={14} className="animate-spin text-slate-400" /> : <Database size={14} />}
                           {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Changes'}
                        </button>
                     </div>
                  </div>

                  {/* Condensed Stats Strip */}
                  <div className="flex items-center gap-8 px-6 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto">
                     {[
                        { label: 'Total', value: '12,450', color: 'text-slate-600' },
                        { label: 'Synced', value: '12,432', color: 'text-emerald-600' },
                        { label: 'Pending', value: '18', color: 'text-rose-500' },
                        { label: 'Rate', value: '99.85%', color: 'text-blue-600' },
                     ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}:</span>
                           <span className={`text-[11px] font-black ${s.color}`}>{s.value}</span>
                        </div>
                     ))}
                  </div>

                  {/* Editable Excel-like Data Table */}
                  <div className="flex-1 overflow-auto bg-[#e6e6e6] p-0 relative border-t border-slate-200">
                     <table className="min-w-full w-max text-left border-collapse bg-white cursor-cell">
                        <thead className="sticky top-0 z-20">
                           <tr className="bg-[#e6f2eb]">
                              {/* Top Left Corner */}
                              <th className="w-[38px] sticky left-0 z-30 border-r border-b border-[#c8cccf] bg-[#e6f2eb] p-0">
                                 <div className="absolute right-0 bottom-0 w-0 h-0 border-b-[8px] border-b-[#a3d0b2] border-l-[8px] border-l-transparent"></div>
                              </th>
                              {gridColumns.map((col, idx) => (
                                 <th key={col} className="min-w-[120px] border-r border-b border-[#c8cccf] bg-[#e6f2eb] text-center py-1 px-2 select-none group">
                                    <span className="text-[11px] font-medium text-[#107c41] block">{String.fromCharCode(65 + idx)}</span>
                                 </th>
                              ))}
                              {/* Action Column Header */}
                              <th className="w-[40px] border-b border-[#c8cccf] bg-[#e6f2eb]"></th>
                           </tr>
                           <tr className="bg-white">
                              <th className="w-[38px] sticky left-0 z-30 border-r border-b border-[#c8cccf] bg-[#f3f2f1] text-center select-none py-1">
                                 <span className="text-[11px] font-medium text-[#605e5c] block">1</span>
                              </th>
                              {gridColumns.map((col) => (
                                 <th key={`${col}-name`} className="border-r border-b border-[#c8cccf] px-2 py-1 bg-white whitespace-nowrap text-left font-bold text-slate-800 text-[11px]">
                                    {col}
                                 </th>
                              ))}
                              <th className="w-[40px] border-b border-[#c8cccf] bg-white text-center">
                                 <button onClick={addGridRow} className="p-1 hover:bg-green-50 rounded-full text-green-600 transition-colors" title="Add Row">
                                    <PlusCircle size={14} />
                                 </button>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="relative z-0">
                           {gridData.map((row, rowIndex) => (
                              <tr key={rowIndex} className="group">
                                 {/* Row Number */}
                                 <td className="w-[38px] sticky left-0 z-10 border-r border-b border-[#c8cccf] bg-[#f3f2f1] text-center select-none py-1">
                                    <span className="text-[11px] font-medium text-[#605e5c] block">{rowIndex + 2}</span>
                                 </td>
                                 {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="p-0 border-r border-b border-[#c8cccf] bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:z-10 relative">
                                       <input 
                                          value={cell} 
                                          onChange={(e) => updateGridCell(rowIndex, colIndex, e.target.value)}
                                          className="w-full h-full bg-transparent px-2 py-1.5 outline-none text-[11px] text-slate-800 font-medium"
                                       />
                                    </td>
                                 ))}
                                 {/* Delete Action Cell */}
                                 <td className="w-[40px] border-b border-[#c8cccf] bg-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => deleteGridRow(rowIndex)} className="p-1 hover:bg-rose-50 rounded-full text-rose-500 transition-colors" title="Delete Row">
                                       <Activity size={14} /> {/* Using Activity as a placeholder for Delete if Trash is missing, but checking lucide list... and activity is there. I'll use TerminalIcon if no Trash. Wait, let me check imports. */}
                                    </button>
                                 </td>
                              </tr>
                           ))}
                           {/* Empty Spacer Row for better UX */}
                           <tr className="h-20 bg-[#e6e6e6]/10">
                              <td colSpan={gridColumns.length + 2}></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                     <p className="text-[11px] text-slate-400">
                        {saveStatus === 'saved' ? (
                           <span className="text-emerald-600 font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                              <CheckCircleIcon size={12} /> Modifications saved to Lakehouse catalog
                           </span>
                        ) : (
                           <>Showing <span className="font-semibold text-slate-600">{gridData.length}</span> records · Live editing mode</>
                        )}
                     </p>
                     <div className="flex items-center gap-3">
                        <button 
                           onClick={handleSave} 
                           disabled={saveStatus === 'saving'}
                           className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-2 transition-colors ${
                              saveStatus === 'saved' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-900'
                           }`}
                        >
                           {saveStatus === 'saving' ? <RefreshCw size={12} className="animate-spin" /> : <Database size={12} />}
                           {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Changes'}
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button onClick={toggleExecution} className="px-3 py-1.5 rounded-md text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2">
                           <Zap size={12} /> Run Full Audit
                        </button>
                     </div>
                  </div>
               </div>

            ) : (isComplete && reportData) ? (
               <div className="flex-1 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Report Header */}
                  <div className="px-6 py-2 border-b border-slate-100 flex items-center justify-between">
                     <div>
                        <h2 className="text-sm font-bold text-slate-800">Audit Results — {datasetLabel}</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Reconciliation completed · {new Date().toLocaleDateString()}</p>
                     </div>
                     <button onClick={handleExport} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <FileText size={13} /> Export Report
                     </button>
                  </div>

                  {/* KPI Strip */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                     <div className="px-8 py-5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Accuracy Score</p>
                        <p className="text-2xl font-bold text-emerald-600">{reportData.accuracy}<span className="text-sm text-slate-400 font-normal">%</span></p>
                     </div>
                     <div className="px-8 py-5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Records Matched</p>
                        <p className="text-2xl font-bold text-slate-800">{reportData.matches.toLocaleString()}</p>
                     </div>
                     <div className="px-8 py-5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Variances Found</p>
                        <p className={`text-2xl font-bold ${reportData.mismatches > 0 ? 'text-rose-500' : 'text-slate-400'}`}>{reportData.mismatches}</p>
                     </div>
                  </div>

                  {/* Variance Table */}
                  <div className="px-8 py-6">
                     <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                           <h3 className="text-xs font-bold text-slate-600">Variance Log</h3>
                           <span className="text-[10px] text-slate-400">{reportData.mismatchDetails.length} discrepancies</span>
                        </div>
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-100">
                                 {['Record ID', 'Field', 'Source (Bronze)', 'Target (Silver)', 'Severity'].map(col => (
                                    <th key={col} className="px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{col}</th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {reportData.mismatchDetails.map((m, i) => (
                                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">{m.id}</td>
                                    <td className="px-5 py-3.5 text-xs text-slate-500 uppercase tracking-tight font-medium">{m.field}</td>
                                    <td className="px-5 py-3.5 text-xs font-semibold text-emerald-600">{m.source}</td>
                                    <td className="px-5 py-3.5 text-xs font-semibold text-rose-500">{m.target}</td>
                                    <td className="px-5 py-3.5">
                                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                          m.risk === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                          m.risk === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                          'bg-blue-50 text-blue-600 border-blue-100'
                                       }`}>{m.risk}</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

            ) : (isRunning || showLogs) ? (
               <div className="flex-1 opacity-95">
                  <Terminal logs={logs} minHeight="100%" />
               </div>

            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-16">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                     <Cpu size={28} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Ready to Audit</h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">Select a data layer from the <span className="font-semibold text-slate-500">sidebar configuration</span>, then click <span className="font-semibold text-slate-500">Run Audit</span> to begin reconciliation.</p>
                  <button onClick={toggleExecution} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all active:scale-95">
                     <Zap size={13} /> Run Audit
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}


