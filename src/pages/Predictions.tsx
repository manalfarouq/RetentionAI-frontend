import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Employee } from '../types';
import EmployeeFolder from '../components/EmployeeFolder';

const Predictions: React.FC = () => {
  const { employees, authState } = useApp();
  const [formData, setFormData] = useState({
    Age: '',
    JobLevel: '',
    MonthlyIncome: ''
    // ajoute ici les autres champs nécessaires
  });
  const [predictionResult, setPredictionResult] = useState<Employee | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.token) return;

    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setPredictionResult({
      id: data.employee_id,
      name: `Employee_${data.employee_id}`,
      prediction: data.attrition === 1 ? 'Va quitter' : 'Va rester',
      probability: data.risque === 'Élevé' ? data.probability : 0,
      retentionStrategy: data.retention_strategy || ''
    });
  };

  const handleNewPrediction = () => {
    setFormData({ Age: '', JobLevel: '', MonthlyIncome: '' });
    setPredictionResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-serif mb-8">Prédictions</h1>

      {!predictionResult ? (
        <form onSubmit={handlePredict} className="space-y-4 mb-8">
          <input type="number" name="Age" placeholder="Age" value={formData.Age} onChange={handleChange} required />
          <input type="number" name="JobLevel" placeholder="Job Level" value={formData.JobLevel} onChange={handleChange} required />
          <input type="number" name="MonthlyIncome" placeholder="Monthly Income" value={formData.MonthlyIncome} onChange={handleChange} required />
          <button type="submit" className="px-4 py-2 bg-darkBrown text-white rounded">Prédire</button>
        </form>
      ) : (
        <div className="mb-8">
          <p>Prédiction: {predictionResult.prediction}</p>
          <p>Probabilité: {predictionResult.probability}%</p>
          {predictionResult.retentionStrategy && (
            <div>
              <h4>Stratégie de rétention :</h4>
              <ul>
                {predictionResult.retentionStrategy.split('\n').map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          <button onClick={handleNewPrediction} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
            Nouvelle prédiction
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
        {employees.map(emp => (
          <EmployeeFolder key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
};

export default Predictions;
