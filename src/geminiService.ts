import { GoogleGenerativeAI } from "@google/generative-ai";
import { Employee, RiskLevel } from "./types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function predictRiskAndGeneratePlan(employee: Partial<Employee>) {
  const prompt = `Analysez le profil de l'employé suivant et prédisez son risque de départ.
  Fournissez un score de risque de 0 à 100 et un plan de rétention détaillé et de haute qualité si le score est de 60 ou plus.
  TOUTES LES RÉPONSES DOIVENT ÊTRE EN FRANÇAIS.

  Données de l'employé :
  Nom : ${employee.name}
  Poste : ${employee.title}
  Département : ${employee.department}
  Années dans l'entreprise : ${employee.tenureYears}
  Évaluation de la performance (1-5) : ${employee.performanceRating}
  Rémunération : ${employee.compensation}€

  Formatez le plan de rétention comme un document RH professionnel avec des sections telles que :
  - Aperçu stratégique
  - Actions immédiates recommandées
  - Développement à long terme
  - Ajustements de rémunération (si applicable)
  - Stratégie de reconnaissance
  
  Répondez UNIQUEMENT avec un objet JSON valide dans ce format exact:
  {
    "riskScore": <nombre entre 0 et 100>,
    "riskLevel": "<LOW ou MEDIUM ou HIGH>",
    "retentionPlan": "<plan détaillé en markdown>"
  }`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const parsed = JSON.parse(jsonText);
    
    if (typeof parsed.riskScore !== 'number' || 
        !['LOW', 'MEDIUM', 'HIGH'].includes(parsed.riskLevel) ||
        typeof parsed.retentionPlan !== 'string') {
      throw new Error('Format de réponse invalide');
    }
    
    return parsed;
  } catch (error) {
    console.error("Échec de la prédiction du risque Gemini :", error);
    
    const tenureYears = employee.tenureYears || 1;
    const perfRating = employee.performanceRating || 3;
    const compensation = employee.compensation || 50000;
    
    let baseScore = 50;
    
    if (tenureYears < 2) baseScore += 20;
    if (tenureYears > 5) baseScore -= 15;
    if (perfRating < 3) baseScore += 15;
    if (perfRating >= 4) baseScore -= 20;
    if (compensation < 45000) baseScore += 10;
    
    const score = Math.max(0, Math.min(100, baseScore + Math.random() * 20 - 10));
    const level = score > 70 ? RiskLevel.HIGH : score > 40 ? RiskLevel.MEDIUM : RiskLevel.LOW;
    
    return {
      riskScore: Math.round(score),
      riskLevel: level,
      retentionPlan: `### Aperçu Stratégique

L'analyse du profil de ${employee.name} indique un niveau de risque ${level === RiskLevel.HIGH ? 'élevé' : level === RiskLevel.MEDIUM ? 'moyen' : 'faible'} de départ. Cette évaluation est basée sur plusieurs facteurs clés incluant l'ancienneté, la performance et la rémunération.

### Actions Immédiates Recommandées

- Planifier un entretien individuel dans les 2 semaines
- Évaluer les opportunités de développement professionnel
- Réviser les objectifs de performance et alignement avec les attentes
- Identifier les points de friction potentiels

### Développement à Long Terme

- Établir un plan de carrière clair sur 12-24 mois
- Proposer des formations ciblées selon les aspirations professionnelles
- Créer des opportunités de mentorat
- Renforcer l'engagement par des projets stimulants

### Ajustements de Rémunération

${score > 60 ? '- Révision salariale recommandée pour aligner avec le marché\n- Considérer des avantages additionnels (télétravail, flexibilité)' : '- La rémunération semble alignée avec le marché\n- Maintenir une révision annuelle'}

### Stratégie de Reconnaissance

- Mettre en place un système de feedback régulier
- Valoriser publiquement les contributions significatives
- Créer des opportunités de visibilité au sein de l'organisation

**Note**: Ce plan a été généré en mode hors ligne. Pour une analyse plus approfondie, veuillez vérifier la connexion à l'API Gemini.`
    };
  }
}