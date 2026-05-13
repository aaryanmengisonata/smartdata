import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ListChecks, 
  Zap, 
  Save, 
  Search,
  FileText,
  Activity
} from 'lucide-react';

const INITIAL_VALIDATIONS = [
  { id: 'v1', name: 'Null Ratio Check', desc: 'Ensures target column has highly similar null ratios as the source table, preventing data loss during ELT.', type: 'Data Quality' },
  { id: 'v2', name: 'Format Matching', desc: 'Validates that column data types and string formats match the expected regex standard.', type: 'Schema Validate' },
  { id: 'v3', name: 'Volume Diff', desc: 'Compares the volume of row changes against an expected threshold between Delta layers.', type: 'Reconciliation' },
  { id: 'v4', name: 'Referential Integrity', desc: 'Checks foreign keys across Bronze -> Silver layer joins to ensure no orphaned records exist.', type: 'Integrity Check' }
];

export default function ValidationPanel() {
  const [validations, setValidations] = useState(INITIAL_VALIDATIONS);
  const [activeValidationId, setActiveValidationId] = useState(INITIAL_VALIDATIONS[0].id);
  const [mode, setMode] = useState('existing'); // 'existing' | 'new'
  
  // Form states to persist data when switching modes
  const [existingForm, setExistingForm] = useState({ name: '', desc: '' });
  const [newForm, setNewForm] = useState({ name: '', prompt: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize existingForm with the selected validation
  useEffect(() => {
    const active = validations.find(v => v.id === activeValidationId);
    if (active) {
      setExistingForm({ name: active.name, desc: active.desc });
    }
  }, [activeValidationId, validations]);

  const handleSave = () => {
    if (isSaveDisabled) return;

    setIsSaving(true);
    // Simulate API call/processing
    setTimeout(() => {
      if (mode === 'existing') {
        setValidations(prev => prev.map(v => 
          v.id === activeValidationId 
            ? { ...v, name: existingForm.name, desc: existingForm.desc } 
            : v
        ));
      } else {
        const newId = `v${Date.now()}`;
        const newVal = {
          id: newId,
          name: newForm.name,
          desc: newForm.prompt,
          type: 'Custom API'
        };
        setValidations(prev => [...prev, newVal]);
        setActiveValidationId(newId);
        setMode('existing');
        // Reset new form
        setNewForm({ name: '', prompt: '' });
      }
      
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const isSaveDisabled = mode === 'existing' 
    ? !existingForm.name.trim() || !existingForm.desc.trim()
    : !newForm.name.trim() || !newForm.prompt.trim();

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/40 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        
        {/* Main Redesigned Container */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
          
          {/* Top Control Bar (Horizontal) */}
          <div className="px-8 py-5 border-b border-slate-100 grid grid-cols-3 items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
            
            {/* Left: Existing Button */}
            <div className="flex justify-start">
              <button 
                onClick={() => setMode('existing')}
                className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                  mode === 'existing' 
                    ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ListChecks size={18} className={mode === 'existing' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'} />
                Existing
                {mode === 'existing' && (
                  <span className="absolute -bottom-[21px] left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            </div>

            {/* Center: New Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => setMode('new')}
                className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                  mode === 'new' 
                    ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Plus size={18} className={mode === 'new' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'} />
                New
                {mode === 'new' && (
                  <span className="absolute -bottom-[21px] left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            </div>

            {/* Right: Save Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaveDisabled || isSaving}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 shadow-lg ${
                  saveSuccess 
                    ? 'bg-emerald-500 text-white shadow-emerald-200' 
                    : isSaveDisabled || isSaving
                      ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                }`}
              >
                {saveSuccess ? (
                  <><CheckCircle2 size={18} /> Saved!</>
                ) : isSaving ? (
                  <><Zap size={18} className="animate-pulse" /> Saving...</>
                ) : (
                  <><Save size={18} /> Save Changes</>
                )}
              </button>
            </div>
          </div>

          {/* Content Area (Shared) */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            <div className="max-w-2xl mx-auto">
              
              {mode === 'existing' ? (
                <div key="existing-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                  
                  {/* Selector for existing items */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      <Search size={12} className="text-blue-500" />
                      Select Existing Functionality
                    </label>
                    <div className="relative group">
                      <select
                        value={activeValidationId}
                        onChange={(e) => setActiveValidationId(e.target.value)}
                        className="w-full appearance-none bg-slate-50/50 text-[14px] font-bold text-slate-700 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer hover:border-slate-300 shadow-sm"
                      >
                        {validations.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" size={20} />
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                  {/* Fields */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        <FileText size={12} className="text-blue-500" />
                        Title
                      </label>
                      <input 
                        type="text"
                        value={existingForm.name}
                        onChange={(e) => setExistingForm({...existingForm, name: e.target.value})}
                        className="w-full bg-white text-[15px] font-semibold text-slate-800 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:text-slate-300"
                        placeholder="Validation Name"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        <Activity size={12} className="text-blue-500" />
                        Info / Description
                      </label>
                      <textarea 
                        value={existingForm.desc}
                        onChange={(e) => setExistingForm({...existingForm, desc: e.target.value})}
                        className="w-full min-h-[220px] bg-white text-[14px] leading-relaxed text-slate-600 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm resize-none placeholder:text-slate-300"
                        placeholder="Define the behavior and logic rules for this validation..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div key="new-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Validation Name</label>
                      <input 
                        type="text"
                        value={newForm.name}
                        onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                        className="w-full bg-white text-[15px] font-semibold text-slate-800 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:text-slate-300"
                        placeholder="e.g., Cross-Layer Consistency Check"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Validation Prompt</label>
                      <textarea 
                        value={newForm.prompt}
                        onChange={(e) => setNewForm({...newForm, prompt: e.target.value})}
                        className="w-full min-h-[220px] bg-white text-[14px] leading-relaxed text-slate-600 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm resize-none placeholder:text-slate-300"
                        placeholder="Describe the validation logic you want to implement... (e.g., 'Check if the total sum of amount in Silver matches Bronze layer within 0.01% tolerance')"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>



        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
