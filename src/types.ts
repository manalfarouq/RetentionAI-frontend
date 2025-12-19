// src/types.ts
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  title: string;
  hireYear: number;
  tenureYears: number;
  performanceRating: number;
  compensation: number;
  riskScore: number;
  riskLevel: RiskLevel;
  retentionPlan?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
}