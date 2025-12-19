import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Employee } from '../types';
import FileFolder from '../components/FileFolder';
import EmployeeFolder from '../components/EmployeeFolder';
import { predictRiskAndGeneratePlan } from '../geminiService';
import { Loader2, Plus, ArrowLeft, Send } from 'lucide-react';

const Predictions: React.FC = () => {
  const { employees, addEmployee } = useApp();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Group employees by year
  const years = Array.from(new Set(employees.map((e: Employee) => e.hireYear))).sort((a: number, b: number) => b - a);
  const filteredEmployees = selectedYear ? employees.filter((e: Employee) => e.hireYear === selectedYear) : [];

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    title: '',
    hireYear: new Date().getFullYear(),
    tenureYears: 1,
    performanceRating: 3,
    compensation: 50000
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await predictRiskAndGeneratePlan(formData);
      
      const newEmployee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        retentionPlan: result.retentionPlan
      };
      
      addEmployee(newEmployee);
      setShowAddForm(false);
      setSelectedYear(newEmployee.hireYear);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-darkBrown/40 mb-2 uppercase italic font-serif">Gestion des Talents</h2>
          <h1 className="font-serif text-6xl md:text-8xl text-darkBrown italic leading-none">Archives</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-3 bg-darkBrown text-cream px-8 py-4 rounded-full text-[10px] font-bold tracking-widest hover:bg-sage transition-all shadow-xl"
        >
          <Plus size={16} /> AJOUTER UN NOUVEAU DOSSIER
        </button>
      </div>

      {!selectedYear && !showAddForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 animate-fadeIn">
          {years.length > 0 ? (
            years.map((year: number, idx: number) => (
              <FileFolder 
                key={year} 
                label={year.toString()} 
                count={employees.filter((e: Employee) => e.hireYear === year).length}
                colorClass={idx % 4 === 0 ? 'bg-sage' : idx % 4 === 1 ? 'bg-olive' : idx % 4 === 2 ? 'bg-darkBrown' : 'bg-dustyPink'}
                onClick={() => setSelectedYear(year)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-darkBrown/10 rounded-xl">
              <p className="font-serif text-2xl italic text-darkBrown/40">Aucune archive trouvée. Commencez par ajouter un employé.</p>
            </div>
          )}
        </div>
      )}

      {selectedYear && !showAddForm && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => setSelectedYear(null)}
              className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-darkBrown/50 hover:text-darkBrown transition-colors"
            >
              <ArrowLeft size={14} /> RETOUR AUX ANNÉES
            </button>
            <div className="text-sm font-serif italic text-darkBrown/40">
              Année de référence : {selectedYear}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-16 justify-items-center">
             {filteredEmployees.map((emp: Employee) => (
               <EmployeeFolder 
                key={emp.id} 
                employee={emp} 
               />
             ))}
          </div>
          
          {filteredEmployees.length === 0 && (
             <div className="py-20 text-center">
               <p className="font-serif text-2xl italic text-darkBrown/40">Aucun dossier dans cette archive.</p>
             </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-darkBrown/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-cream w-full max-w-2xl rounded-2xl p-10 shadow-2xl animate-scaleUp relative grainy">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-6 right-6 text-darkBrown/40 hover:text-darkBrown font-bold tracking-widest text-[10px]"
            >
              FERMER [X]
            </button>
            <h2 className="font-serif text-5xl italic text-darkBrown mb-8">Nouveau Profil</h2>
            
            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">NOM COMPLET</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  placeholder="ex: Jean Valjean"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">DÉPARTEMENT</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  placeholder="ex: Logistique"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">TITRE DU POSTE</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  placeholder="ex: Directeur Artistique"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">ANNÉE DE RECRUTEMENT</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  value={formData.hireYear}
                  onChange={e => setFormData({...formData, hireYear: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">NOTE DE PERFORMANCE (1-5)</label>
                <input 
                  required
                  type="number" 
                  step="0.1"
                  max="5"
                  min="0"
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  value={formData.performanceRating}
                  onChange={e => setFormData({...formData, performanceRating: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">SALAIRE ANNUEL (€)</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-transparent border-b border-darkBrown/20 py-2 focus:border-darkBrown outline-none transition-all font-serif text-2xl italic"
                  value={formData.compensation}
                  onChange={e => setFormData({...formData, compensation: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="col-span-full pt-12">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-darkBrown text-cream py-6 rounded-full font-bold tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-sage transition-all disabled:opacity-50 shadow-2xl"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> ANALYSE EN COURS...</>
                  ) : (
                    <><Send size={18} /> GÉNÉRER LE DOSSIER D'INTELLIGENCE</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predictions;