"use client";

import { Activity, Users, AlertTriangle, CheckCircle, TrendingUp, Clock, Info } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Patients", value: "145", icon: <Users size={24} />, color: "bg-blue-500", detail: "↑ 12% from last month" },
    { label: "High Risk Patients", value: "12", icon: <AlertTriangle size={24} />, color: "bg-red-500", detail: "Critical attention needed" },
    { label: "Recent Analyses", value: "8", icon: <Activity size={24} />, color: "bg-emerald-500", detail: "Last 24 hours" },
    { label: "Success Rate", value: "98.5%", icon: <CheckCircle size={24} />, color: "bg-indigo-500", detail: "Clinical alignment" },
  ];

  const recentPatients = [
    { id: 1, name: "John Doe", age: 45, diagnosis: "Hypertension", risk: 70, status: "Reviewing" },
    { id: 2, name: "Jane Smith", age: 52, diagnosis: "Type 2 Diabetes", risk: 85, status: "Critical" },
    { id: 3, name: "Sam Johnson", age: 28, diagnosis: "Normal", risk: 10, status: "Completed" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Welcome back, Dr. Roberts. System overview for today.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center space-x-2 text-slate-500 text-sm shadow-sm">
          <Clock size={16} />
          <span>Last Updated: Mar 19, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-lg text-white ${stat.color} shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <p className="text-slate-500 font-medium">{stat.label}</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h2>
              <p className={`mt-3 text-xs font-semibold ${stat.label === "High Risk Patients" ? "text-red-500" : "text-emerald-500"}`}>
                {stat.detail}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <TrendingUp size={20} className="text-primary" />
            <span>Recent High-Risk Cases</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 font-semibold text-slate-500 text-sm">Patient</th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-sm">Diagnosis</th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-sm">Risk Score</th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{patient.name}</p>
                      <p className="text-slate-400 text-xs">Age: {patient.age}y</p>
                    </td>
                    <td className="py-4 px-4 italic text-slate-600">{patient.diagnosis}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${patient.risk > 80 ? 'bg-red-500' : 'bg-orange-500'}`} 
                            style={{ width: `${patient.risk}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{patient.risk}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        patient.status === 'Critical' ? 'bg-red-50 text-red-600' : 
                        patient.status === 'Reviewing' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {patient.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Info size={20} className="text-primary" />
            <span>AI Operational Status</span>
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Clinical Data Stream</p>
                <p className="text-slate-500 text-sm mt-1">Real-time extraction active. No latency detected in PDF processing pipeline.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Diagnosis Engine</p>
                <p className="text-slate-500 text-sm mt-1">Rule-based hybrid logic synced with WHO 2024 protocols.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                <Activity size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Ethical Audit Layer</p>
                <p className="text-slate-500 text-sm mt-1">Last fairness audit: Today 08:30 AM. No demographic bias found.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100">
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
              System Health Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
