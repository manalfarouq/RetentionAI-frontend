# zoroRH - Frontend 

**Interface Web pour la Rétention des Talents RH**

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Description

Le **frontend zoroRH** est une application web moderne destinée aux **responsables Ressources Humaines**, leur permettant d'interagir simplement avec le moteur d'intelligence artificielle développé côté backend.

### Interface Intuitive Pour

-  **S'authentifier** avec JWT
-  **Saisir** les informations d'un employé
-  **Visualiser** le risque de départ en temps réel
-  **Consulter** un plan de rétention personnalisé (IA Gemini)
-  **Gérer** les dossiers et historiques employés

---

##  Objectifs

### Fonctionnels
- ✅ Connexion/Authentification sécurisée (JWT)
- ✅ Formulaire de saisie profil employé
- ✅ Affichage du risque de départ (churn probability)
- ✅ Génération automatique de plans de rétention
- ✅ Consultation des résultats structurés
- ✅ Navigation intuitive et professionnelle

### Techniques
- ✅ Consommer API FastAPI sécurisée
- ✅ Gestion d'état global (React Context)
- ✅ TypeScript pour type safety
- ✅ Design responsive (Tailwind CSS)
- ✅ Build optimisé avec Vite
- ✅ Dockerisation complète

---

##  Architecture
```
Utilisateur RH
      ↓
   [Login JWT]
      ↓
Frontend (React + Vite)
      ↓
   API Calls (Axios)
      ↓
Backend FastAPI
      ↓
[PostgreSQL + Gemini AI]
```

---

##  Structure du Projet
```
RETENTIONAI-FRONTEND/
├── 📂 .next/                      # Cache build (si Next.js)
├── 📂 node_modules/               # Dépendances npm
├── 📂 src/                        # Code source
│   │
│   ├── 📂 api/                    # Configuration réseau
│   │   └── index.ts               # Setup Axios / Fetch
│   │
│   ├── 📂 components/             # Composants réutilisables
│   │   ├── EmployeeFolder.tsx     # Affichage dossier employé
│   │   ├── FileFolder.tsx         # Gestion fichiers/dossiers
│   │   └── Navbar.tsx             # Barre navigation
│   │
│   ├── 📂 pages/                  # Pages principales
│   │   ├── Home.tsx               # Page d'accueil
│   │   ├── Login.tsx              # Connexion
│   │   ├── Predictions.tsx        # Prédictions ML
│   │   └── RetentionPlans.tsx     # Plans de rétention
│   │
│   ├── App.tsx                    # Composant racine
│   ├── AppContext.tsx             # État global (Context API)
│   ├── geminiService.ts           # Service IA Gemini
│   ├── index.css                  # Styles globaux
│   ├── index.tsx                  # Point d'entrée React
│   └── types.ts                   # Interfaces TypeScript
│
├── .env                           # Variables environnement
├── .gitignore                     # Fichiers exclus Git
├── index.html                     # HTML racine
├── package.json                   # Dépendances & scripts
├── postcss.config.js              # Config PostCSS
├── README.md                      # Documentation
├── tailwind.config.js             # Config Tailwind
├── tsconfig.json                  # Config TypeScript
├── vite.config.ts                 # Config Vite
└── vite-env.d.ts                  # Types Vite
```

---

## Technologies

| Catégorie | Stack |
|-----------|-------|
| **Framework** | React 18+ |
| **Language** | TypeScript 5.0+ |
| **Build Tool** | Vite 5.0+ |
| **Styling** | Tailwind CSS 3.0+ |
| **HTTP Client** | Axios / Fetch API |
| **State Management** | React Context API |
| **Routing** | React Router (si utilisé) |
| **IA Integration** | Google Gemini Service |

---

## Installation

### Prérequis
- **Node.js 18+** ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **Backend zoroRH** en cours d'exécution sur `http://localhost:8000`

### Installation Locale
```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/zororh-frontend.git
cd zororh-frontend

# 2. Installer les dépendances
npm install
# ou
yarn install

# 3. Configuration environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Configuration `.env`
```env
# Backend API
VITE_API_URL=http://localhost:8001

# Gemini AI (si appel direct depuis frontend)
VITE_GEMINI_API_KEY=your_gemini_api_key_optional

# Environment
VITE_ENV=development
```

### Lancer en Développement
```bash
npm run dev
# ou
yarn dev
```

✅ Application accessible sur : **http://localhost:5173/**

### Build pour Production
```bash
# Build
npm run build
# ou
yarn build

# Preview du build
npm run preview
# ou
yarn preview
```

---

## Installation Docker

### Dockerfile
```dockerfile
# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

```
### Lancer avec Docker
```bash
# Build et lancer
docker-compose up -d

# Logs
docker-compose logs -f frontend

# Arrêter
docker-compose down
```

✅ **Frontend** : http://localhost:5173
✅ **Backend** : http://localhost:8001

---

## Authentification JWT

### Flux d'Authentification
```typescript
// src/api/index.ts

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Parcours Utilisateur

### Connexion
```
Utilisateur → Saisie username/password
          ↓
       POST /login
          ↓
   Réception JWT token
          ↓
   Stockage localStorage
          ↓
   Redirection /home
```

### Saisie Profil Employé
```typescript
// src/pages/Predictions.tsx

interface EmployeeData {
  Age: number;
  Department: string;
  JobRole: string;
  MonthlyIncome: number;
  YearsAtCompany: number;
  JobSatisfaction: number;
  WorkLifeBalance: number;
  OverTime: 'Yes' | 'No';
  DistanceFromHome: number;
  NumCompaniesWorked: number;
}

const [employeeData, setEmployeeData] = useState<EmployeeData>({
  Age: 0,
  Department: '',
  JobRole: '',
  MonthlyIncome: 0,
  YearsAtCompany: 0,
  JobSatisfaction: 1,
  WorkLifeBalance: 1,
  OverTime: 'No',
  DistanceFromHome: 0,
  NumCompaniesWorked: 0,
});
```
---

**Commandes :**
```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint

# Formatage code
npm run format

# Tests
npm run test
```
---

## Sécurité

### Bonnes Pratiques

- ✅ **Tokens JWT** stockés dans `localStorage`
- ✅ **Intercepteurs Axios** pour gestion automatique auth
- ✅ **Redirection 401** vers login
- ✅ **Variables env** pour URLs sensibles
- ✅ **Validation** des entrées utilisateur
- ✅ **HTTPS** en production

---

## Liens Utiles

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
