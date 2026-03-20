"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Plus, Users, LayoutGrid, List, X } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  risk_score: number;
  phone: string;
  lastVisit?: string;
}

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    diagnosis: "General Review",
    risk_score: 10,
    phone: ""
  });

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/patients");
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPatient,
          age: parseInt(newPatient.age),
          risk_score: parseFloat(newPatient.risk_score.toString())
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setNewPatient({ name: "", age: "", diagnosis: "General Review", risk_score: 10, phone: "" });
        fetchPatients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
             <div className="bg-primary p-2 rounded-lg text-white">
               <Users size={20} />
             </div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
          </div>
          <p className="text-slate-500 mt-2 text-lg">Manage and review all patient clinical records.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-primary text-white font-bold py-3 px-6 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span>Add New Patient</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
             <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
               <X size={24} />
             </button>
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Register New Patient</h2>
             <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 font-semibold">Full Name</label>
                   <input 
                     required 
                     className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary shadow-sm" 
                     placeholder="John Smith" 
                     value={newPatient.name}
                     onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 font-semibold">Age</label>
                      <input 
                        required 
                        type="number" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary shadow-sm" 
                        placeholder="45" 
                        value={newPatient.age}
                        onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 font-semibold">Initial Risk score</label>
                      <input 
                        required 
                        type="number" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary shadow-sm" 
                        placeholder="10" 
                        value={newPatient.risk_score}
                        onChange={e => setNewPatient({...newPatient, risk_score: parseFloat(e.target.value)})}
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 font-semibold">Diagnosis / Note</label>
                   <input 
                     required 
                     className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary shadow-sm" 
                     placeholder="Hypertension" 
                     value={newPatient.diagnosis}
                     onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 font-semibold">Phone Number</label>
                   <input 
                     required 
                     className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary shadow-sm" 
                     placeholder="555-0199" 
                     value={newPatient.phone}
                     onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                   />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-6 hover:bg-blue-700 transition shadow-lg">
                   Save Patient Record
                </button>
             </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, diagnosis, ID..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3 h-full">
            <button className="flex items-center space-x-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`px-4 py-3 ${viewMode === 'list' ? 'bg-slate-100 text-primary' : 'bg-white text-slate-400 hover:bg-slate-50'} transition-colors`}
               >
                 <List size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-slate-100 text-primary' : 'bg-white text-slate-400 hover:bg-slate-50'} transition-colors`}
               >
                 <LayoutGrid size={20} />
               </button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 rounded-lg">
                  <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Patient Name</th>
                  <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Age</th>
                  <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Diagnosis</th>
                  <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Risk Level</th>
                  <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 text-primary font-bold rounded-lg flex items-center justify-center text-sm shadow-sm">
                          {patient.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 group-hover:text-primary transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">
                            ID: PT-00{patient.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-600 font-semibold">{patient.age}y</td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        patient.diagnosis === 'Normal' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      } border ${
                        patient.diagnosis === 'Normal' ? 'border-green-100' : 'border-blue-100'
                      }`}>
                        {patient.diagnosis}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              patient.risk_score > 80 ? 'bg-red-500' : 
                              patient.risk_score > 50 ? 'bg-orange-500' : 
                              'bg-green-500'
                            }`} 
                            style={{ width: `${patient.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{patient.risk_score}%</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white text-primary font-bold rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                        {patient.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        patient.diagnosis === 'Normal' ? 'bg-white text-green-600 border-green-100' : 'bg-white text-blue-600 border-blue-100'
                      }`}>
                        {patient.diagnosis}
                      </span>
                   </div>
                   <h4 className="text-xl font-extrabold text-slate-800">{patient.name}</h4>
                   <p className="text-slate-500 text-sm mt-1 uppercase tracking-tight font-semibold">Age: {patient.age}y • ID: PT-00{patient.id}</p>
                   
                   <div className="mt-8">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                        <span>Risk Score</span>
                        <span>{patient.risk_score}%</span>
                      </div>
                      <div className="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            patient.risk_score > 80 ? 'bg-red-500' : 
                            patient.risk_score > 50 ? 'bg-orange-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${patient.risk_score}%` }}
                        ></div>
                      </div>
                   </div>
                   
                   <div className="mt-8 flex justify-between items-center text-sm font-semibold border-t border-slate-200 pt-4 text-slate-400">
                      <span>Last Visit: {patient.lastVisit}</span>
                      <button className="text-primary hover:underline font-bold">Details</button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
