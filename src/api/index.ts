// src/api/index.ts
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Identifiants invalides");
  }

  return res.json();
}

export const getEmployees = async (token: string) => {
  const url = `${API_URL}/GetAllEmployees?token=${encodeURIComponent(token)}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: { 
      "accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des employés");
  }

  const data = await res.json();
  return data.users || data || [];
};

export const predictAttrition = async (token: string, employeeData: any) => {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(employeeData)
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      throw new Error('SESSION_EXPIRED');
    }
    
    const error = await res.json().catch(() => ({ detail: 'Erreur serveur' }));
    throw new Error(error.detail || 'Erreur lors de la prédiction');
  }

  return res.json();
};

export const generateRetentionPlan = async (token: string, planData: any) => {
  const res = await fetch(`${API_URL}/generate-retention-plan`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "accept": "application/json",
      "token": token
    },
    body: JSON.stringify(planData)
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la génération du plan");
  }

  return res.json();
};