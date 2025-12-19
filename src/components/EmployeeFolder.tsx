import React from 'react';
import { Employee, RiskLevel } from '../types';
import { Paperclip } from 'lucide-react';

interface EmployeeFolderProps {
  employee: Employee;
  onClick?: () => void;
}

const EmployeeFolder: React.FC<EmployeeFolderProps> = ({ employee, onClick }) => {
  // Calculer le niveau de risque basé sur la probabilité
  const getRiskLevel = (prob: number): RiskLevel => {
    if (prob >= 70) return RiskLevel.HIGH;
    if (prob >= 40) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-600 border-red-200 bg-red-50';
      case RiskLevel.MEDIUM: return 'text-orange-600 border-orange-200 bg-orange-50';
      case RiskLevel.LOW: return 'text-green-600 border-green-200 bg-green-50';
      default: return 'text-darkBrown/40 border-darkBrown/10';
    }
  };

  const riskLevel = employee.riskLevel || getRiskLevel(employee.probability);
  const riskScore = employee.riskScore || employee.probability;

  return (
    <div 
      onClick={onClick}
      className="relative w-full max-w-[450px] aspect-[3/4] cursor-pointer group transition-all duration-500 hover:-translate-y-4"
    >
      <div className="absolute inset-0 bg-white/40 -rotate-1 rounded-sm border border-black/5 translate-y-1"></div>
      <div className="absolute inset-0 bg-white/60 rotate-1 rounded-sm border border-black/5 -translate-y-1"></div>
      
      <div className="absolute inset-0 bg-manila rounded-sm border border-darkBrown/10 folder-shadow flex flex-col p-8 grainy">
        
        <div className="flex justify-between items-start mb-12">
          <div className="text-[10px] font-bold tracking-[0.2em] text-darkBrown/40 uppercase">
            DOSSIER RH / {employee.department || 'N/A'}
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-darkBrown/40">
            {employee.hireYear || new Date().getFullYear()}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-0">
          <span className="font-script text-6xl text-darkBrown mb-[-15px] z-10 rotate-[-5deg]">Employé</span>
          <h3 className="font-sans text-5xl font-black tracking-tight text-darkBrown uppercase leading-none mb-4">
            DOSSIER
          </h3>
          <div className="w-12 h-[1px] bg-darkBrown/20 mb-4"></div>
          <p className="font-sans text-lg font-bold tracking-widest text-darkBrown uppercase">
            {employee.name}
          </p>
          <p className="text-[10px] font-medium tracking-[0.3em] text-darkBrown/50 uppercase mt-2">
            {employee.title || 'Employé'}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className={`px-4 py-2 border-2 rounded-md transform rotate-[-12deg] text-sm font-black tracking-[0.2em] uppercase ${getRiskColor(riskLevel)}`}>
            RISQUE: {riskScore}%
          </div>
        </div>

        <div className="mt-auto flex justify-between items-end border-t border-darkBrown/5 pt-4">
          <span className="text-[8px] font-bold tracking-widest text-darkBrown/30">@ZORORH_OFFICIAL</span>
          <span className="text-[8px] font-bold tracking-widest text-darkBrown/30">ZORORH.COM</span>
        </div>

        <div className="absolute -top-6 -right-4 w-32 aspect-[4/5] bg-white p-2 polaroid-shadow rotate-[8deg] transition-transform group-hover:rotate-[12deg]">
          <div className="w-full h-[80%] bg-gray-200 overflow-hidden mb-2">
            <img 
              src={`https://i.pravatar.cc/150?u=${employee.id}`} 
              alt={employee.name} 
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-400 rotate-[-10deg]">
            <Paperclip size={24} strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFolder;