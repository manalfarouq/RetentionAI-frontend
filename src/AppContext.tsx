import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, AuthState, RiskLevel } from 'src/types.ts'; 

interface AppContextType {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  authState: AuthState;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Jeanne Dupont',
    department: 'Design',
    title: 'Designer de Marque Senior',
    hireYear: 2024,
    tenureYears: 2,
    performanceRating: 4.5,
    compensation: 85000,
    riskScore: 75,
    riskLevel: RiskLevel.HIGH,
    retentionPlan: "### Aperçu stratégique\nJeanne est un atout critique pour l'équipe de design. Son score de risque élevé est probablement dû à une rémunération stagnante par rapport aux tarifs du marché.\n\n### Actions immédiates recommandées\n- Organiser une session de cartographie de carrière en tête-à-tête.\n- Offrir une augmentation de salaire de 10% pour s'ajuster au marché.\n\n### Développement à long terme\n- L'inscrire à la série d'ateliers 'Leadership Créatif'."
  },
  {
    id: '2',
    name: 'Julien Thorne',
    department: 'Marketing',
    title: 'Spécialiste de la Croissance',
    hireYear: 2024,
    tenureYears: 1,
    performanceRating: 3.2,
    compensation: 62000,
    riskScore: 25,
    riskLevel: RiskLevel.LOW
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('muse_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('muse_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  useEffect(() => {
    localStorage.setItem('muse_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('muse_auth', JSON.stringify(authState));
  }, [authState]);

  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [employee, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const login = (email: string) => {
    setAuthState({ isAuthenticated: true, user: { name: 'Admin', email } });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AppContext.Provider value={{ employees, addEmployee, updateEmployee, authState, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};