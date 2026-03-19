"use client";

import { Info, Gauge, ShieldCheck, Scale, Database, Cpu, Search, CheckCircle, AlertTriangle } from "lucide-react";

export default function Transparency() {
  const modelSpecs = [
    { label: "Pipeline Status", value: "Verified Active", icon: <CheckCircle size={20} />, color: "text-emerald-500", detail: "Last sync 08:30 AM" },
    { label: "Confidence Threshold", value: "92.5%", icon: <Gauge size={20} />, color: "text-indigo-500", detail: "Minimum safety margin" },
    { label: "Data Quality Score", value: "98.8%", icon: <Database size={20} />, color: "text-emerald-500", detail: "PDF extraction accuracy" },
    { label: "Ethical Audit", value: "Passed", icon: <ShieldCheck size={20} />, color: "text-primary", detail: "Zero demographic bias" },
  ];

  const featureImportance = [
    { feature: "Glucose Level", weight: 45, impact: "Critical (Direct diagnosis factor)" },
    { feature: "Blood Pressure (Systolic)", weight: 30, impact: "Critical (Hypertension indicator)" },
    { feature: "Total Cholesterol", weight: 15, impact: "Moderate (Cardiovascular risk)" },
    { feature: "Patient Age", weight: 10, impact: "Low (Adjustable dosage factor)" },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
        <div className="flex-1">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
             <div className="bg-primary p-2 rounded-lg text-white shadow-xl shadow-blue-100">
               <Info size={24} />
             </div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase tracking-widest text-slate-400">Explainable AI Audit</h1>
          </div>
          <p className="text-slate-500 mt-2 text-xl font-bold">Total Transparency into Clinical Decision Logic</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-2xl flex items-center space-x-4 text-white shadow-2xl">
           <div className="p-3 bg-white/10 rounded-xl text-primary">
              <Cpu size={28} className="animate-pulse" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model Version</p>
              <p className="text-lg font-black font-mono">CARE-INTEL-v4.2.1-EX</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelSpecs.map((spec, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-primary/20 group">
             <div className={`p-3 rounded-xl bg-slate-50 ${spec.color} mb-6 w-fit group-hover:bg-slate-100 transition-colors`}>{spec.icon}</div>
             <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{spec.label}</h4>
             <p className="text-2xl font-black text-slate-900 tracking-tight">{spec.value}</p>
             <p className="text-slate-400 text-xs font-medium mt-2">{spec.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center space-x-3">
                 <Search size={24} className="text-primary" />
                 <span>Feature Weight Distribution</span>
              </h3>
              <div className="space-y-10">
                 {featureImportance.map((f, i) => (
                    <div key={i} className="space-y-3 group">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-slate-800 font-extrabold text-lg">{f.feature}</p>
                             <p className="text-slate-400 text-xs font-bold italic">{f.impact}</p>
                          </div>
                          <p className="text-primary font-black text-xl">{f.weight}%</p>
                       </div>
                       <div className="w-full h-8 bg-slate-50 rounded-2xl overflow-hidden shadow-inner p-1">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-xl shadow-lg shadow-blue-100/30 transition-all duration-1000 origin-left scale-x-0 group-hover:scale-x-100" 
                            style={{ width: `${f.weight}%`, transition: `width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)` }}
                          ></div>
                       </div>
                    </div>
                 ))}
                 {/* Trigger initial animation placeholder */}
                 <div className="animate-in fade-in duration-1000"></div>
              </div>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner border-l-8 border-l-primary">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                 <Scale size={20} className="text-primary" />
                 <span>Clinical Decision Workflow</span>
              </h3>
              <div className="space-y-8">
                 {[
                   { step: 1, title: "Data Ingestion", desc: "PDF OCR extraction parses clinical markers into structured JSON." },
                   { step: 2, title: "Marker Validation", desc: "Values checked against historical biological ranges for outlier detection." },
                   { step: 3, title: "Threshold Analysis", desc: "Hybrid rule-logic applies WHO & ADA diagnostic criteria." },
                   { step: 4, title: "Ethical Reconciliation", desc: "System checks for demographic bias and clinical safety protocols." },
                 ].map((s, i) => (
                    <div key={i} className="flex space-x-6 relative">
                       {i < 3 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200"></div>}
                       <div className="w-12 h-12 bg-white border-2 border-primary rounded-2xl flex items-center justify-center font-black text-primary text-xl shadow-sm shrink-0 z-10">
                          {s.step}
                       </div>
                       <div>
                          <p className="font-extrabold text-lg text-slate-800 leading-tight">{s.title}</p>
                          <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">{s.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center space-x-2">
                 <ShieldCheck size={24} className="text-primary" />
                 <span>Ethical Integrity Report</span>
              </h3>
              <div className="space-y-6">
                 {[
                   { label: "Patient Privacy", status: "GDPR/HIPAA Aligned", icon: <CheckCircle size={20} className="text-emerald-500" /> },
                   { label: "Bias Mitigation", status: "Fairness Layer Active", icon: <CheckCircle size={20} className="text-emerald-500" /> },
                   { label: "Clinical Safety", status: "Human-in-the-Loop", icon: <CheckCircle size={20} className="text-emerald-500" /> },
                   { label: "Blackbox Risk", status: "Explainable Logic Only", icon: <CheckCircle size={20} className="text-emerald-500" /> },
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                          <p className="text-slate-800 font-extrabold text-sm">{item.status}</p>
                       </div>
                       {item.icon}
                    </div>
                 ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs font-bold leading-relaxed border-l-4 border-l-blue-400">
                 <AlertTriangle size={14} className="mb-2" />
                 This model uses deterministic decision trees for clinical diagnostic logic to ensure 100% traceabilty. Neural networks are used solely for auxiliary predictive forecasting.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
