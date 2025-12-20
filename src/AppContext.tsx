import React, { createContext, useContext, useState } from 'react';
import { Employee, AuthState } from './types';
import { loginApi, getEmployees } from './api';

interface AppContextType {
  employees: Employee[];
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    
    setAuthState({ isAuthenticated: false, user: null, token: null });
    setEmployees([]);
  };

  const login = async (username: string, password: string) => {
    const data = await loginApi(username, password);
    
    // CORRECTION : Stocker le token dans localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id.toString());
    localStorage.setItem('username', data.username);
    
    setAuthState({
      isAuthenticated: true,
      user: { id: data.user_id, username: data.username },
      token: data.token
    });
    
    // Récupérer les employés automatiquement après login
    const employeeData = await getEmployees(data.token);

    // Mapper retention_strategy du backend vers retentionStrategy dans le frontend
    setEmployees(employeeData.map((e: any) => ({
      ...e,
      retentionStrategy: e.retention_strategy
    })));
  };

  return (
    <AppContext.Provider value={{ employees, authState, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp doit être utilisé dans AppProvider');
  return context;
};