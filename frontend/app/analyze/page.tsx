"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, FileType, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Scale, ShieldAlert, Cpu, Stethoscope, Activity, Info } from "lucide-react";

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch("http://127.0.0.1:8000/upload-report", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      
      // Simulate analysis delay
      setTimeout(() => {
        setResult(data);
        sessionStorage.setItem("lastAnalysis", JSON.stringify(data));
        setAnalyzing(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
      alert("Backend connection failed. Ensure FastAPI is running on port 8000.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center md:text-left">
        <div className="flex items-center space-x-3 justify-center md:justify-start">
           <div className="bg-primary p-2 rounded-lg text-white">
             <Stethoscope size={24} />
           </div>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Patient Report Analysis</h1>
        </div>
        <p className="text-slate-500 mt-2 text-lg">Upload digital medical reports for AI-driven clinical insights and ethical review.</p>
      </div>

      {!result && !analyzing && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center hover:border-primary/50 transition-all duration-300 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Upload size={36} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Choose Patient PDF</h3>
              <p className="text-slate-500 mt-2 font-medium">Select clinical lab reports or hospital discharge summaries.</p>
            </div>
            
            <div className="max-w-md mx-auto relative group">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-extrabold file:bg-primary file:text-white hover:file:bg-blue-700 transition group-hover:scale-105"
              />
              {file && (
                <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center space-x-2 border border-emerald-100 animate-pulse">
                  <FileType size={18} />
                  <span className="font-bold">{file.name}</span>
                </div>
              )}
            </div>

            <button 
              disabled={!file}
              className="mt-8 px-12 py-4 bg-slate-900 text-white font-bold rounded-xl text-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-xl shadow-slate-200"
            >
              Analyze Clinical Profile
            </button>
          </form>
        </div>
      )}

      {analyzing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-lg animate-fade-in">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                 <Cpu size={32} className="animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Processing Clinical Data</h3>
              <p className="text-slate-500 mt-2 font-medium">Running ethical justification engine & diagnosis risk assessment...</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Top Bar for Results */}
          <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="flex items-center space-x-3">
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-emerald-100">Analysis Complete</span>
                <span className="text-slate-400 text-sm font-medium">ID: AR-992384</span>
             </div>
             <button 
               onClick={() => {setResult(null); setFile(null);}}
               className="text-slate-500 hover:text-primary text-sm font-bold flex items-center space-x-1"
             >
               <span>Upload New</span>
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Diagnosis Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                   <Activity size={20} className="text-primary" />
                   <span>Diagnosis Prediction</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.diagnosis.map((d: string, i: number) => (
                    <div key={i} className="bg-blue-50 text-primary border border-blue-100 px-6 py-4 rounded-xl font-extrabold text-lg flex flex-col shadow-sm">
                      <span className="text-xs uppercase tracking-widest text-slate-400 mb-1">Condition Detected</span>
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medicine Recommendation - MULTI OPTION COMPARISON */}
              <div className="bg-white border border-slate-200 rounded-2xl p-1 shadow-sm mt-8 overflow-hidden">
                <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-700"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center space-x-2 text-primary">
                     <Stethoscope size={20} />
                     <span className="uppercase tracking-widest text-[10px] font-black text-slate-400 font-sans ml-2">Perfect Clinical Match</span>
                  </h3>
                  <p className="text-3xl font-black tracking-tight mb-2">{result.perfect_choice.name}</p>
                  <p className="text-slate-400 font-bold italic text-sm mb-6">{result.perfect_choice.reasoning}</p>
                  
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projected Efficiency</p>
                        <p className="text-lg font-black text-emerald-400">{result.perfect_choice.effectiveness}</p>
                     </div>
                     <Link href="/forecast" className="bg-primary hover:bg-blue-700 text-white font-black py-2 px-6 rounded-xl text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                        View 7-Day Forecast
                     </Link>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
                  {result.medication_options.filter((o:any) => o.name !== result.perfect_choice.name).map((opt: any, i: number) => (
                    <div key={i} className="p-6 border border-slate-100 rounded-2xl hover:border-primary/20 transition-all bg-white shadow-sm hover:shadow-md group">
                       <div className="flex justify-between items-start mb-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alternative Protocol {i+1}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${opt.effectiveness === 'High' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>{opt.effectiveness}</span>
                       </div>
                       <p className="font-extrabold text-slate-800 text-lg group-hover:text-primary transition-colors">{opt.name}</p>
                       <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{opt.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Risk Score Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                   <AlertTriangle size={20} className="text-accent" />
                   <span>Health Risk Index</span>
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-500 uppercase">Aggregated Score</span>
                  <span className={`text-4xl font-black ${result.risk_score > 70 ? 'text-accent' : result.risk_score > 40 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {result.risk_score.toFixed(1)}
                  </span>
                </div>
                <div className="risk-bar">
                  <div 
                    className={`risk-level ${result.risk_score > 70 ? 'bg-accent' : result.risk_score > 40 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${result.risk_score}%` }}
                  ></div>
                </div>
                <p className="mt-6 text-sm text-slate-500 font-medium italic">
                  Based on multiple clinical indicators extracted from historical and current lab data.
                </p>
              </div>

              {/* Ethical AI Section (CRITICAL FEATURE) */}
              <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl shadow-slate-200 border-t-4 border-primary">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-extrabold flex items-center space-x-3">
                      <ShieldCheck size={28} className="text-primary" />
                      <span>Ethical AI Validation</span>
                    </h3>
                    <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-lg text-xs font-bold uppercase">Certified Core</div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                       <div className="flex items-center space-x-2 mb-3 text-emerald-400">
                          <UserCheck size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider font-semibold">Safety Status</span>
                       </div>
                       <p className="text-sm text-slate-100 font-medium leading-relaxed">{result.ethical_analysis.safety}</p>
                    </div>
                    
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                       <div className="flex items-center space-x-2 mb-3 text-blue-400">
                          <Scale size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider font-semibold">Fairness Audit</span>
                       </div>
                       <p className="text-sm text-slate-100 font-medium leading-relaxed">{result.ethical_analysis.fairness}</p>
                    </div>
                    
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                       <div className="flex items-center space-x-2 mb-3 text-indigo-400">
                          <ShieldAlert size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider font-semibold">Bias Detection</span>
                       </div>
                       <p className="text-sm text-slate-100 font-medium leading-relaxed">{result.ethical_analysis.bias_detection}</p>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                       <div className="flex items-center space-x-2 mb-3 text-amber-400">
                          <CheckCircle size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider font-semibold">Guideline Sync</span>
                       </div>
                       <p className="text-sm text-slate-100 font-medium leading-relaxed">{result.ethical_analysis.guideline}</p>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 italic">
                    <p className="flex items-center space-x-2">
                       <Info size={14} />
                       <span>{result.ethical_analysis.disclaimer}</span>
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
