"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, FileType, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Scale, ShieldAlert, Cpu, Stethoscope, Activity, Info, RefreshCw, FileText, ArrowRight, MessageSquare, X, AlertOctagon, ClipboardList, TrendingUp, Plus, Pill as Medkit } from "lucide-react";

interface LLMAnalysis {
  conditions: string[];
  diagnosis?: string;
  severity: string;
  recommended_medicines: string[];
  interaction_alerts: string[];
  reasoning: string[];
  risks?: string[];
  confidence_score: number;
  clinical_summary: string;
  thought_trace?: string[];
  soap_note?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  citations?: string[];
  risk_trajectory?: {
    day_0: number;
    day_7: number;
    day_30: number;
    day_90: number;
    trend: string;
  };
  treatment_response?: {
    medicine: string;
    effectiveness_percentage: number;
    bp_reduction_likelihood: number;
    glucose_control_probability: number;
    confidence: number;
  };
  side_effects?: {
    medicine: string;
    effect: string;
    probability: number;
    severity: string;
  }[];
  inconsistency_detected?: {
    issue: string;
    possible_causes: string[];
    severity: string;
  }[];
  confidence_breakdown?: {
    data_completeness: number;
    guideline_match: number;
    risk_uncertainty: number;
    final_confidence: number;
  };
  second_opinion?: {
    alternative_plan: string[];
    reason: string;
    confidence: number;
  };
  alerts?: {
    type: string;
    message: string;
    priority: string;
  }[];
  human_readable_summary?: string;
}

interface AnalysisResult {
  diagnosis: string;
  risk_score: number;
  ethical_audit: string;
  llm_analysis: LLMAnalysis;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'intake' | 'results'>('upload');
  
  const [currentMeds, setCurrentMeds] = useState<string>("");
  const [lifestyle, setLifestyle] = useState({
    activity: "Medium",
    smokes: false,
    diet: "Standard"
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("current_meds", JSON.stringify(currentMeds.split(',').map(m => m.trim())));
    formData.append("lifestyle", JSON.stringify(lifestyle));

    try {
      const response = await fetch("http://127.0.0.1:8000/full-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMessage.trim() || !result) return;
    const userMsg: ChatMessage = { role: 'user', content: pendingMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setPendingMessage("");
    try {
      const resp = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pendingMessage, patient_text: result.llm_analysis.clinical_summary, history: chatMessages }),
      });
      const data = await resp.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-4 uppercase italic leading-[0.8] drop-shadow-sm">
            Neural<br/><span className="text-primary not-italic">Nexus</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg tracking-tight flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Advanced Clinical Intelligence v5.0
          </p>
        </div>
        {result && (
          <button onClick={() => {setResult(null); setStep('upload'); setFile(null);}} className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all duration-500 shadow-2xl">
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform" />
            New Cycle
          </button>
        )}
      </div>

      {!result && step === 'upload' && (
        <div className="max-w-4xl mx-auto animate-fade-in-up bg-white p-20 rounded-[3rem] border border-slate-200 shadow-2xl text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 mx-auto group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload size={40} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Upload Report</h2>
            <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file ? (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 font-bold">{file.name}</div>
                  <button onClick={() => setStep('intake')} className="w-64 h-20 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Confirm File</button>
                </div>
            ) : (
                <button onClick={() => document.getElementById('file-upload')?.click()} className="px-10 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase">Browse System</button>
            )}
        </div>
      )}

      {!result && step === 'intake' && (
        <div className="max-w-4xl mx-auto animate-fade-in-up bg-white p-20 rounded-[3rem] border border-slate-200 shadow-2xl">
            <h2 className="text-4xl font-black text-slate-900 mb-12 uppercase italic underline decoration-primary decoration-4">Clinical <span className="text-primary not-italic">Audit</span></h2>
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Current Medications</label>
                <textarea value={currentMeds} onChange={(e) => setCurrentMeds(e.target.value)} placeholder="e.g. Metformin 500mg..." className="w-full h-40 bg-slate-50 border border-slate-100 rounded-3xl p-8 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Activity Level</label>
                  <select value={lifestyle.activity} onChange={(e) => setLifestyle({...lifestyle, activity: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold outline-none"><option>Low</option><option>Medium</option><option>High</option><option>Sedentary</option></select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Diet</label>
                  <select value={lifestyle.diet} onChange={(e) => setLifestyle({...lifestyle, diet: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold outline-none"><option>Standard</option><option>Keto</option><option>Vegan</option></select>
                </div>
              </div>
              <button onClick={handleUpload} disabled={loading} className="w-full h-24 bg-slate-900 text-white rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50">{loading ? "Processing..." : "Initiate Advanced Intelligence"}</button>
            </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in-up space-y-12 pb-32">
          {/* 1. Human Readable summary */}
          {result.llm_analysis.human_readable_summary && (
            <div className="bg-primary/5 border-2 border-primary/10 p-12 rounded-[4rem] relative group">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.5em] mb-8 flex items-center gap-2 italic"><Cpu size={16} /> AI Executive Summary</h3>
              <div className="prose prose-slate max-w-none text-slate-800 font-bold leading-relaxed whitespace-pre-wrap text-lg italic">
                {result.llm_analysis.human_readable_summary}
              </div>
            </div>
          )}

          {/* 2. Inconsistency Alert */}
          {result.llm_analysis.inconsistency_detected && result.llm_analysis.inconsistency_detected.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-xl animate-pulse-subtle">
              <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30 font-black">!</div>
              <div>
                <h3 className="text-xl font-black text-rose-900 uppercase tracking-tight italic mb-2">Inconsistency Detected</h3>
                {result.llm_analysis.inconsistency_detected.map((inc, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-rose-800 font-extrabold text-sm">{inc.issue} <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded ml-2 uppercase opacity-70">Severity: {inc.severity}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Neural Trace */}
          <div className="bg-slate-900 p-10 rounded-[4rem] border border-white/5 shadow-3xl text-white">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-10 flex items-center gap-2"><Cpu size={18} /> Neural Reasoning Trace</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="p-8 bg-black/40 rounded-3xl border border-white/5 font-mono text-[11px] leading-relaxed max-h-[250px] overflow-y-auto scrollbar-hide text-slate-500">
                  {result.llm_analysis.thought_trace?.map((trace: string, i: number) => (
                    <div key={i} className="flex gap-4 py-1 border-b border-white/5">
                      <span className="text-slate-800 shrink-0 italic">[{i}]</span>
                      <span className={`${trace.includes('API_LIMIT') || trace.includes('QUOTA') ? 'text-amber-500' : trace.includes('Routing') ? 'text-primary' : 'text-slate-400'}`}>{trace}</span>
                    </div>
                  ))}
              </div>
              <div className="space-y-6">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                   <div className="flex justify-between mb-4"><h1 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Confidence</h1><span className="text-2xl font-black text-primary">{result.llm_analysis.confidence_score}%</span></div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-primary" style={{width: `${result.llm_analysis.confidence_score}%`}}></div></div>
                </div>
                <p className="text-slate-400 text-sm font-bold border-l-2 border-primary pl-6 italic">Multi-agent clinical vectorization complete. All reasoning paths synchronized.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-12">
              {/* 4. Primary Diagnosis */}
              <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-xl group relative overflow-hidden">
                 <h2 className="text-5xl font-black text-slate-900 mb-8 uppercase italic leading-[0.8]">Neural<br/><span className="text-primary not-italic">Diagnosis</span></h2>
                 <p className="text-3xl font-bold text-slate-700 leading-tight mb-12 italic">{result.diagnosis || result.llm_analysis.diagnosis}</p>
                 <div className="grid grid-cols-2 gap-6">
                    {(result.llm_analysis.conditions || []).map((c, i) => (
                      <div key={i} className="flex items-center space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic font-black text-xs tracking-widest text-slate-800 uppercase">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                        <span>{c}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* 5. Risk Trajectory */}
              {result.llm_analysis.risk_trajectory && (
                <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl">
                   <div className="flex justify-between mb-12">
                      <h3 className="text-xs font-black text-primary uppercase tracking-[0.5em] italic flex items-center gap-3"><TrendingUp size={16} /> 90-Day Risk Forecast</h3>
                      <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-xl font-black text-[10px] uppercase">Trend: {result.llm_analysis.risk_trajectory.trend}</div>
                   </div>
                   <div className="flex justify-between items-end gap-6 h-40 px-6">
                      {[
                        { l: 'Today', v: result.llm_analysis.risk_trajectory.day_0 },
                        { l: 'Day 7', v: result.llm_analysis.risk_trajectory.day_7 },
                        { l: 'Day 30', v: result.llm_analysis.risk_trajectory.day_30 },
                        { l: 'Day 90', v: result.llm_analysis.risk_trajectory.day_90 }
                      ].map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                           <div className="w-full bg-white/5 h-32 rounded-2xl relative border border-white/5">
                              <div className="absolute bottom-0 w-full bg-primary/40 rounded-b-2xl transition-all duration-1000" style={{height: `${s.v}%`}}></div>
                           </div>
                           <span className="mt-4 text-[10px] font-black uppercase text-slate-500">{s.l}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div className="space-y-12">
               {/* 6. Treatment Effectiveness */}
               {result.llm_analysis.treatment_response && (
                 <div className="bg-gradient-to-br from-indigo-700 to-blue-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-10 italic">Treatment effectiveness</h3>
                    <div className="space-y-6">
                       <p className="text-2xl font-black italic">{result.llm_analysis.treatment_response.medicine}</p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/20 p-5 rounded-2xl text-center">
                             <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Response</p>
                             <p className="text-2xl font-black text-emerald-400">{result.llm_analysis.treatment_response.effectiveness_percentage}%</p>
                          </div>
                          <div className="bg-black/20 p-5 rounded-2xl text-center">
                             <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Recovery</p>
                             <p className="text-2xl font-black text-blue-400">{result.llm_analysis.treatment_response.glucose_control_probability || result.llm_analysis.treatment_response.bp_reduction_likelihood}%</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* 7. Side Effects */}
               {result.llm_analysis.side_effects && result.llm_analysis.side_effects.length > 0 && (
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 italic">Predictive Side Effects</h3>
                    <div className="space-y-4">
                       {result.llm_analysis.side_effects.map((se, i) => (
                         <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div><p className="text-[10px] font-black uppercase text-slate-600 mb-1">{se.medicine}</p><p className="text-xs font-bold text-slate-900">{se.effect}</p></div>
                            <div className="text-right font-black text-rose-500 text-sm">{se.probability}%</div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* 8. Second Opinion */}
               {result.llm_analysis.second_opinion && (
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 border-dashed">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Second Opinion</h3>
                    <p className="text-slate-800 font-extrabold text-sm mb-6 leading-relaxed italic">"{result.llm_analysis.second_opinion.reason}"</p>
                    <div className="flex flex-wrap gap-2">
                       {result.llm_analysis.second_opinion.alternative_plan.map((alt, i) => (
                         <span key={i} className="text-[9px] font-black uppercase px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 tracking-tighter">{alt}</span>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Advisor */}
      {result && (
        <div className={`fixed bottom-12 right-12 transition-all duration-700 z-50 ${chatVisible ? 'w-[450px]' : 'w-20 hidden'}`}>
           <div className="bg-white rounded-[4rem] shadow-3xl border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                <div className="bg-slate-900 p-10 text-white flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40"><Cpu size={24} className="text-primary animate-pulse" /></div>
                      <div>
                        <h3 className="font-black text-lg italic tracking-tight leading-none uppercase">Nexus Advisor</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Consultation Matrix</p>
                      </div>
                   </div>
                   <button onClick={() => setChatVisible(false)}><X size={28} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/50">
                   {chatMessages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-3xl text-sm font-bold shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                           {msg.content}
                        </div>
                     </div>
                   ))}
                </div>
                <form onSubmit={handleChat} className="p-10 bg-white border-t border-slate-100">
                   <div className="flex gap-4">
                      <input value={pendingMessage} onChange={(e) => setPendingMessage(e.target.value)} placeholder="Inquire clinical data..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 font-bold outline-none" />
                      <button type="submit" className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all"><ArrowRight size={28} /></button>
                   </div>
                </form>
           </div>
        </div>
      )}
      
      {/* Small Toggle for Chat if Hidden */}
      {result && !chatVisible && (
        <button onClick={() => setChatVisible(true)} className="fixed bottom-12 right-12 w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] shadow-3xl flex items-center justify-center hover:bg-primary transition-all group z-50">
           <MessageSquare size={36} />
        </button>
      )}
    </div>
  );
}
