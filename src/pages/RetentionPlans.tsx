import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Employee } from '../types';
import { ShieldAlert, ChevronRight, FileText, Download } from 'lucide-react';

const RetentionPlans: React.FC = () => {
  const { employees } = useApp();
  const atRiskEmployees = employees.filter((e: Employee) => e.riskScore >= 60);
  const [selectedId, setSelectedId] = useState<string | null>(atRiskEmployees[0]?.id || null);

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
                  {emp.riskScore}% RISQUE
                </div>
                <div className={`font-serif text-2xl ${selectedId === emp.id ? 'text-cream' : 'text-darkBrown'}`}>
                  {emp.name}
                </div>
                <div className={`text-[10px] font-bold tracking-widest mt-1 ${selectedId === emp.id ? 'text-cream/70' : 'text-darkBrown/60'}`}>
                  {emp.title}
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
                   <p className="text-xs font-bold tracking-widest opacity-80 uppercase">{selectedEmployee.department} • EMBAUCHE {selectedEmployee.hireYear}</p>
                </div>
                <button className="bg-cream/20 p-4 rounded-full hover:bg-cream/30 transition-all">
                  <Download size={20} />
                </button>
              </div>
              
              <div className="p-10">
                <div className="prose max-w-none text-darkBrown/80 font-light leading-relaxed">
                  {selectedEmployee.retentionPlan ? (
                    <div className="space-y-8">
                       {selectedEmployee.retentionPlan.split('\n\n').map((para: string, i: number) => {
                         if (para.startsWith('###')) {
                           return <h3 key={i} className="font-serif text-2xl italic text-darkBrown mt-8 border-b border-darkBrown/10 pb-2">{para.replace('### ', '')}</h3>
                         }
                         if (para.startsWith('-')) {
                           return (
                             <ul key={i} className="space-y-2">
                               {para.split('\n').map((item: string, j: number) => (
                                 <li key={j} className="flex gap-4 items-start">
                                   <ChevronRight size={14} className="mt-1 text-sage flex-shrink-0" />
                                   <span>{item.replace('- ', '')}</span>
                                 </li>
                               ))}
                             </ul>
                           )
                         }
                         return <p key={i}>{para}</p>
                       })}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <FileText size={48} className="mx-auto text-darkBrown/10 mb-4" />
                      <p className="italic">Données du plan manquantes pour cet employé.</p>
                    </div>
                  )}
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