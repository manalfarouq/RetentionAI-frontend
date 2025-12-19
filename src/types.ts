// src/types.ts
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Employee {
  id: number;
  name: string;
  prediction: string;  // "Va quitter" ou "Va rester"
  probability: number; // 0-100
  user_id?: number;
  
  // Champs optionnels pour compatibilité avec l'ancien design
  department?: string;
  title?: string;
  hireYear?: number;
  riskLevel?: RiskLevel;
  riskScore?: number;

  retentionStrategy?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
  } | null;
  token: string | null;
}