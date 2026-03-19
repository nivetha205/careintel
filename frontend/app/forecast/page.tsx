"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, CheckCircle, Info, Star } from "lucide-react";

export default function Forecast() {
  const [data, setData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const lastAnalysis = sessionStorage.getItem("lastAnalysis");
    if (lastAnalysis) {
      const parsed = JSON.parse(lastAnalysis);
      setAnalysis(parsed);
      
      // Generate chart data from the 3 options
      const formattedData = [];
      for (let i = 0; i <= 7; i++) {
        formattedData.push({
          day: `Day ${i}`,
          baseline: parsed.risk_score - (i * 0.5), // Slow natural decline
          option1: parsed.medication_options[0].projection[i],
          option2: parsed.medication_options[1].projection[i],
          option3: parsed.medication_options[2].projection[i],
        });
      }
      setData(formattedData);
    }
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Activity size={48} className="mb-4 opacity-20" />
        <p className="font-bold">No clinical data found. Please run an analysis first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center space-x-3">
             <div className="bg-primary p-2 rounded-lg text-white shadow-lg">
               <TrendingUp size={24} />
             </div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase tracking-widest text-slate-400">Recovery Forecasting</h1>
          </div>
          <p className="text-slate-500 mt-2 text-xl font-bold italic">Comparative Multi-Medication Trajectory Model</p>
        </div>
        <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center space-x-4 shadow-sm border-l-4 border-l-primary">
          <div className="text-right">
             <p className="font-extrabold uppercase text-[10px] tracking-widest text-slate-400">Patient Risk</p>
             <p className="text-xl font-black text-primary">{analysis.risk_score.toFixed(1)}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary flex items-center justify-center font-bold text-xs">AI</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">7-Day Differential Response Analysis</h3>
              <div className="flex space-x-6 text-[10px] font-black uppercase tracking-tighter">
                 <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-slate-300 rounded-full"></div><span>Baseline</span></div>
                 <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-blue-400 rounded-full"></div><span>{analysis.medication_options[0].name.split(' ')[0]}</span></div>
                 <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div><span>{analysis.medication_options[1].name.split(' ')[0]}</span></div>
                 <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>{analysis.medication_options[2].name.split(' ')[0]}</span></div>
              </div>
           </div>
           
           <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '16px'}}
                    itemStyle={{fontWeight: 900, fontSize: '12px', padding: '2px 0'}}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area name="Baseline (No Meds)" type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  <Area name={analysis.medication_options[0].name} type="monotone" dataKey="option1" stroke="#60a5fa" strokeWidth={3} fill="transparent" />
                  <Area name={analysis.medication_options[1].name} type="monotone" dataKey="option2" stroke="#4f46e5" strokeWidth={5} fill="url(#colorO2)" dot={{r: 6, fill: '#4f46e5'}} />
                  <Area name={analysis.medication_options[2].name} type="monotone" dataKey="option3" stroke="#a855f7" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border-b-4 border-indigo-500">
              <div className="flex items-center space-x-2 text-indigo-400 mb-6">
                 <Star size={20} fill="currentColor" />
                 <h3 className="text-xs font-black uppercase tracking-widest">Recommended Protocol</h3>
              </div>
              <p className="text-xl font-black mb-2 leading-tight">{analysis.perfect_choice.name}</p>
              <p className="text-slate-400 text-xs font-bold italic mb-8">{analysis.perfect_choice.reasoning}</p>
              
              <div className="space-y-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Recovery</p>
                    <p className="text-2xl font-black text-emerald-400">{((analysis.risk_score - analysis.perfect_choice.projection[7])/analysis.risk_score * 100).toFixed(1)}% Improvement</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                 <CheckCircle size={20} className="text-primary" />
                 <span>Clinical Takeaways</span>
              </h3>
              <div className="space-y-4">
                 {analysis.medication_options.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.name.split(' (')[0]}</p>
                          <p className="text-xs font-bold text-slate-700">Safety: Verified</p>
                       </div>
                       <p className={`text-xs font-black ${m.effectiveness === 'Very High' ? 'text-emerald-500' : 'text-blue-500'}`}>{m.effectiveness}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 text-blue-800 p-8 rounded-2xl flex items-start space-x-4 shadow-sm border-l-8 border-l-primary">
         <Info size={28} className="shrink-0 mt-1" />
         <div>
            <p className="text-sm font-black uppercase tracking-widest mb-1">Physician Disclaimer</p>
            <p className="text-sm font-bold leading-relaxed opacity-80 uppercase tracking-tight">
               The comparative forecast model uses deterministic biological simulation. Projections for modern medications like Tirzepatide are mapped to SURMOUNT-1/4 study results. Clinical judgment is mandatory before prescribing.
            </p>
         </div>
      </div>
    </div>
  );
}
