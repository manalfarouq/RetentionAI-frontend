import React, { useState, useEffect } from 'react';
import { User, Calendar, DollarSign, Briefcase, Clock, X, TrendingUp } from 'lucide-react';
import { predictAttrition } from '../api';

// Types
interface PredictionFormData {
  Age: string;
  JobLevel: string;
  MonthlyIncome: string;
  StockOptionLevel: string;
  TotalWorkingYears: string;
  YearsAtCompany: string;
  YearsInCurrentRole: string;
  YearsWithCurrManager: string;
  EnvironmentSatisfaction: string;
  JobInvolvement: string;
  JobSatisfaction: string;
  BusinessTravel_Travel_Frequently: string;
  'JobRole_Laboratory Technician': string;
  'JobRole_Research Director': string;
  'JobRole_Sales Representative': string;
  MaritalStatus_Divorced: string;
  MaritalStatus_Married: string;
  MaritalStatus_Single: string;
  OverTime_No: string;
  OverTime_Yes: string;
}

interface PredictionResult {
  employee_id: number;
  attrition: number;
  probability: number;
  risque: string;
  retention_strategy?: string;
}

interface HistoryItem {
  id: number;
  created_at: string;
  probability: number;
  retention_strategy?: string;
  employee_id?: number;
}

const Predictions: React.FC = () => {
  const [formData, setFormData] = useState<PredictionFormData>({
    Age: '',
    JobLevel: '',
    MonthlyIncome: '',
    StockOptionLevel: '',
    TotalWorkingYears: '',
    YearsAtCompany: '',
    YearsInCurrentRole: '',
    YearsWithCurrManager: '',
    EnvironmentSatisfaction: '',
    JobInvolvement: '',
    JobSatisfaction: '',
    BusinessTravel_Travel_Frequently: '0',
    'JobRole_Laboratory Technician': '0',
    'JobRole_Research Director': '0',
    'JobRole_Sales Representative': '0',
    MaritalStatus_Divorced: '0',
    MaritalStatus_Married: '0',
    MaritalStatus_Single: '0',
    OverTime_No: '0',
    OverTime_Yes: '0',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
      const response = await fetch(`${API_URL}/GetAllEmployees?token=${encodeURIComponent(token)}`, {
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transformer les données des employés en historique
        const historyData = data.users.map((user: any) => ({
          id: user.id,
          employee_id: user.id,
          created_at: new Date().toISOString(),
          probability: user.probability / 100,
          retention_strategy: user.retention_strategy
        }));
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
  const requiredFields = [
    'Age', 'JobLevel', 'MonthlyIncome', 'StockOptionLevel',
    'TotalWorkingYears', 'YearsAtCompany', 'YearsInCurrentRole',
    'YearsWithCurrManager', 'EnvironmentSatisfaction', 'JobInvolvement', 'JobSatisfaction'
  ];

  const missingFields = requiredFields.filter(
    field => formData[field as keyof PredictionFormData] === ''
  );

  if (missingFields.length > 0) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      window.location.href = '/login';
      return;
    }

    // Vérification des champs catégoriels
    const hasMaritalStatus =
      parseInt(formData.MaritalStatus_Divorced) === 1 ||
      parseInt(formData.MaritalStatus_Married) === 1 ||
      parseInt(formData.MaritalStatus_Single) === 1;

    const hasOverTime =
      parseInt(formData.OverTime_No) === 1 ||
      parseInt(formData.OverTime_Yes) === 1;

    const apiData = {
      Age: parseInt(formData.Age),
      JobLevel: parseInt(formData.JobLevel),
      MonthlyIncome: parseFloat(formData.MonthlyIncome),
      StockOptionLevel: parseInt(formData.StockOptionLevel),
      TotalWorkingYears: parseInt(formData.TotalWorkingYears),
      YearsAtCompany: parseInt(formData.YearsAtCompany),
      YearsInCurrentRole: parseInt(formData.YearsInCurrentRole),
      YearsWithCurrManager: parseInt(formData.YearsWithCurrManager),
      EnvironmentSatisfaction: parseInt(formData.EnvironmentSatisfaction),
      JobInvolvement: parseInt(formData.JobInvolvement),
      JobSatisfaction: parseInt(formData.JobSatisfaction),
      BusinessTravel_Travel_Frequently: parseInt(formData.BusinessTravel_Travel_Frequently),
      JobRole_Laboratory_Technician: parseInt(formData['JobRole_Laboratory Technician']),
      JobRole_Research_Director: parseInt(formData['JobRole_Research Director']),
      JobRole_Sales_Representative: parseInt(formData['JobRole_Sales Representative']),
      MaritalStatus_Divorced: hasMaritalStatus ? parseInt(formData.MaritalStatus_Divorced) : 0,
      MaritalStatus_Married: hasMaritalStatus ? parseInt(formData.MaritalStatus_Married) : 0,
      MaritalStatus_Single: hasMaritalStatus ? parseInt(formData.MaritalStatus_Single) : 1,
      OverTime_No: hasOverTime ? parseInt(formData.OverTime_No) : 1,
      OverTime_Yes: hasOverTime ? parseInt(formData.OverTime_Yes) : 0
    };

    console.log('Données envoyées:', apiData);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
    const response = await fetch(`${API_URL}/predict?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Erreur lors de la prédiction');
    }

    const data = await response.json();
    console.log('Réponse reçue:', data);

    const probability = data.probability > 1 ? data.probability : data.probability * 100;

    setResult({
      employee_id: data.employee_id,
      attrition: data.attrition,
      probability: probability,
      risque: data.risque || (data.attrition === 1 ? 'Élevé' : 'Faible'),
      retention_strategy: data.retention_strategy
    });

    await loadHistory();
  } catch (error: any) {
    console.error('Erreur:', error);
    alert(error.message || 'Une erreur est survenue lors de la prédiction');
  } finally {
    setLoading(false);
  }
};


  const handleReset = () => {
    setFormData({
      Age: '',
      JobLevel: '',
      MonthlyIncome: '',
      StockOptionLevel: '',
      TotalWorkingYears: '',
      YearsAtCompany: '',
      YearsInCurrentRole: '',
      YearsWithCurrManager: '',
      EnvironmentSatisfaction: '',
      JobInvolvement: '',
      JobSatisfaction: '',
      BusinessTravel_Travel_Frequently: '0',
      'JobRole_Laboratory Technician': '0',
      'JobRole_Research Director': '0',
      'JobRole_Sales Representative': '0',
      MaritalStatus_Divorced: '0',
      MaritalStatus_Married: '0',
      MaritalStatus_Single: '0',
      OverTime_No: '0',
      OverTime_Yes: '0',
    });
    setResult(null);
  };

  const getRiskColor = (risque: string) => {
    const risk = risque?.toLowerCase();
    if (risk === 'élevé' || risk === 'elevé' || risk === 'high') return 'text-red-600';
    if (risk === 'moyen' || risk === 'medium') return 'text-orange-500';
    if (risk === 'faible' || risk === 'low') return 'text-green-600';
    return 'text-gray-600';
  };

  const getRiskBg = (risque: string) => {
    const risk = risque?.toLowerCase();
    if (risk === 'élevé' || risk === 'elevé' || risk === 'high') return 'bg-red-50 border-red-200';
    if (risk === 'moyen' || risk === 'medium') return 'bg-orange-50 border-orange-200';
    if (risk === 'faible' || risk === 'low') return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-800">Prédictions RH</h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition flex items-center gap-2 text-sm"
          >
            <Clock size={18} />
            {showHistory ? 'Masquer' : 'Historique'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-stone-200">
              <h2 className="text-xl sm:text-2xl font-serif text-stone-800 mb-6">Nouvelle Prédiction</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Âge *
                    </label>
                    <input
                      type="number"
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 35"
                    />
                  </div>

                  {/* Job Level */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Briefcase size={16} className="inline mr-2" />
                      Niveau du poste *
                    </label>
                    <select
                      name="JobLevel"
                      value={formData.JobLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="1">Niveau 1</option>
                      <option value="2">Niveau 2</option>
                      <option value="3">Niveau 3</option>
                      <option value="4">Niveau 4</option>
                      <option value="5">Niveau 5</option>
                    </select>
                  </div>

                  {/* Monthly Income */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <DollarSign size={16} className="inline mr-2" />
                      Revenu mensuel *
                    </label>
                    <input
                      type="number"
                      name="MonthlyIncome"
                      value={formData.MonthlyIncome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 5000"
                    />
                  </div>

                  {/* Stock Option Level */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Stock Options *
                    </label>
                    <select
                      name="StockOptionLevel"
                      value={formData.StockOptionLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="0">Aucune</option>
                      <option value="1">Niveau 1</option>
                      <option value="2">Niveau 2</option>
                      <option value="3">Niveau 3</option>
                    </select>
                  </div>

                  {/* Total Working Years */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Années d'expérience totales *
                    </label>
                    <input
                      type="number"
                      name="TotalWorkingYears"
                      value={formData.TotalWorkingYears}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 10"
                    />
                  </div>

                  {/* Years at Company */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Années dans l'entreprise *
                    </label>
                    <input
                      type="number"
                      name="YearsAtCompany"
                      value={formData.YearsAtCompany}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 5"
                    />
                  </div>

                  {/* Years in Current Role */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Années dans le rôle actuel *
                    </label>
                    <input
                      type="number"
                      name="YearsInCurrentRole"
                      value={formData.YearsInCurrentRole}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 3"
                    />
                  </div>

                  {/* Years With Current Manager */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Années avec le manager actuel *
                    </label>
                    <input
                      type="number"
                      name="YearsWithCurrManager"
                      value={formData.YearsWithCurrManager}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                      placeholder="Ex: 2"
                    />
                  </div>

                  {/* Environment Satisfaction */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Satisfaction environnement *
                    </label>
                    <select
                      name="EnvironmentSatisfaction"
                      value={formData.EnvironmentSatisfaction}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="1">Très faible</option>
                      <option value="2">Faible</option>
                      <option value="3">Moyenne</option>
                      <option value="4">Élevée</option>
                    </select>
                  </div>

                  {/* Job Involvement */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Implication au travail *
                    </label>
                    <select
                      name="JobInvolvement"
                      value={formData.JobInvolvement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="1">Très faible</option>
                      <option value="2">Faible</option>
                      <option value="3">Moyenne</option>
                      <option value="4">Élevée</option>
                    </select>
                  </div>

                  {/* Job Satisfaction */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Satisfaction professionnelle *
                    </label>
                    <select
                      name="JobSatisfaction"
                      value={formData.JobSatisfaction}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="1">Très faible</option>
                      <option value="2">Faible</option>
                      <option value="3">Moyenne</option>
                      <option value="4">Élevée</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Analyse en cours...' : 'Analyser le risque'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résultat */}
          <div className="lg:col-span-1">
            {result ? (
              <div className={`rounded-2xl shadow-lg p-6 border-2 ${getRiskBg(result.risque)}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif text-stone-800">Résultat</h3>
                  <button onClick={() => setResult(null)} className="text-stone-500 hover:text-stone-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-600 mb-1">Niveau de risque</p>
                    <p className={`text-3xl font-bold ${getRiskColor(result.risque)}`}>
                      {result.risque}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-stone-600 mb-1">Probabilité de départ</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${result.probability > 70 ? 'bg-red-500' : result.probability > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${result.probability}%` }}
                        />
                      </div>
                      <span className="text-xl font-bold text-stone-800">
                        {result.probability.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-stone-600 mb-1">Prédiction</p>
                    <p className="text-lg font-medium text-stone-800">
                      {result.attrition === 1 ? '🚪 Va quitter' : '✓ Va rester'}
                    </p>
                  </div>

                  {result.retention_strategy && (
                    <div className="mt-6 pt-4 border-t border-stone-300">
                      <p className="text-sm font-medium text-stone-700 mb-2">
                        Stratégie de rétention
                      </p>
                      <div className="text-sm text-stone-600 space-y-1">
                        {result.retention_strategy.split('\n').map((line, i) => (
                          line.trim() && <p key={i}>• {line.trim()}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white bg-opacity-50 p-8 text-center">
                <div className="text-stone-400 mb-2">
                  <TrendingUp size={48} className="mx-auto mb-3" />
                </div>
                <p className="text-stone-600">
                  Remplissez le formulaire et cliquez sur "Analyser" pour voir les résultats
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Historique */}
        {showHistory && (
          <div className="mt-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-stone-200">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-800 mb-6">Historique des prédictions</h2>
            
            {history.length === 0 ? (
              <p className="text-center text-stone-500 py-8">Aucune prédiction enregistrée</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => {
                  const probability = item.probability > 1 ? item.probability : item.probability * 100;
                  const risque = probability > 70 ? 'Élevé' : probability > 40 ? 'Moyen' : 'Faible';
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 ${getRiskBg(risque)}`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${getRiskColor(risque)}`}>
                            {risque}
                          </span>
                          <span className="text-sm text-stone-600">
                            {new Date(item.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-stone-700">
                          {probability.toFixed(1)}%
                        </span>
                      </div>
                      {item.retention_strategy && (
                        <div className="text-sm text-stone-600 mt-2">
                          <p className="font-medium mb-1">Stratégie:</p>
                          {item.retention_strategy.split('\n').slice(0, 2).map((line, i) => (
                            line.trim() && <p key={i}>• {line.trim()}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;