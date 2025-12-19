import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Employee } from '../types';
import { ShieldAlert, FileText, Download } from 'lucide-react';

const RetentionPlans: React.FC = () => {
  const { employees } = useApp();
  const atRiskEmployees = employees.filter((e: Employee) => (e.riskScore || e.probability) >= 60);
  const [selectedId, setSelectedId] = useState<number | null>(atRiskEmployees[0]?.id || null);

  const selectedEmployee = employees.find((e: Employee) => e.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.4em] text-darkBrown/40 mb-2 uppercase">Stratégie d'Action</h2>
        <h1 className="font-serif text-6xl text-darkBrown italic">Plans de Rétention</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: List of At-Risk Employees */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-500 mb-6 uppercase">
            <ShieldAlert size={14} /> Attention Critique Requise ({atRiskEmployees.length})
          </div>
          
          {atRiskEmployees.length > 0 ? (
            atRiskEmployees.map((emp: Employee) => (
              <button
                key={emp.id}
                onClick={() => setSelectedId(emp.id)}
                className={`w-full text-left p-6 rounded-xl border transition-all ${
                  selectedId === emp.id 
                    ? 'bg-darkBrown border-darkBrown shadow-xl translate-x-2' 
                    : 'bg-cream border-darkBrown/10 hover:border-darkBrown/30'
                }`}
              >
                <div className={`text-[10px] font-bold tracking-widest mb-2 ${selectedId === emp.id ? 'text-cream/50' : 'text-darkBrown/40'}`}>
                  {emp.riskScore || emp.probability}% RISQUE
                </div>
                <div className={`font-serif text-2xl ${selectedId === emp.id ? 'text-cream' : 'text-darkBrown'}`}>
                  {emp.name}
                </div>
                <div className={`text-[10px] font-bold tracking-widest mt-1 ${selectedId === emp.id ? 'text-cream/70' : 'text-darkBrown/60'}`}>
                  {emp.title || 'Employé'}
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 border-2 border-dashed border-darkBrown/10 rounded-2xl text-center">
               <p className="font-serif italic text-darkBrown/40">Aucun employé à risque élevé actuellement.</p>
            </div>
          )}
        </div>

        {/* Main: Plan Detail */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="bg-white rounded-2xl shadow-sm border border-darkBrown/5 overflow-hidden animate-fadeIn">
              <div className="bg-sage p-10 flex justify-between items-center text-cream">
                <div>
                   <h2 className="font-serif text-4xl mb-1">{selectedEmployee.name}</h2>
                   <p className="text-xs font-bold tracking-widest opacity-80 uppercase">
                     {selectedEmployee.department || 'N/A'} • EMBAUCHE {selectedEmployee.hireYear || 'N/A'}
                   </p>
                </div>
                <button className="bg-cream/20 p-4 rounded-full hover:bg-cream/30 transition-all">
                  <Download size={20} />
                </button>
              </div>
              
              <div className="p-10">
                <div className="text-center space-y-6">
                  <div>
                    <div className="text-6xl font-bold text-darkBrown mb-2">
                      {selectedEmployee.riskScore || selectedEmployee.probability}%
                    </div>
                    <p className="text-sm text-darkBrown/60">Probabilité de départ</p>
                  </div>
                  
                  <div className="mt-8 p-6 bg-sage/10 rounded-xl">
                    <h3 className="font-serif text-2xl text-darkBrown mb-4">Prédiction</h3>
                    <p className="text-lg font-bold text-darkBrown">{selectedEmployee.prediction}</p>
                  </div>

                  <div className="text-center py-10 text-darkBrown/40">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-serif italic">
                      Plan de rétention détaillé à venir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-darkBrown/10 rounded-2xl">
              <h3 className="font-serif text-3xl italic text-darkBrown/20">Sélectionnez un profil pour voir le plan</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetentionPlans;