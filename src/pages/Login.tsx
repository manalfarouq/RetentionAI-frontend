import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(username, password);  
      navigate('/predictions');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-scaleUp">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-script text-darkBrown mb-4">zoroRH</h2>
          <h1 className="font-serif text-3xl text-darkBrown">Bon Retour</h1>
          <p className="text-[10px] font-bold tracking-widest text-darkBrown/40 uppercase mt-2">Accédez à vos archives</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl border border-darkBrown/5 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">NOM D'UTILISATEUR</label>
            <input 
              required
              type="text" 
              className="w-full bg-cream/50 border border-darkBrown/10 px-4 py-3 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none transition-all font-sans"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-darkBrown/60">MOT DE PASSE</label>
            <input 
              required
              type="password" 
              className="w-full bg-cream/50 border border-darkBrown/10 px-4 py-3 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none transition-all font-sans"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-darkBrown text-cream py-4 rounded-full font-bold tracking-widest text-xs hover:bg-sage transition-all mt-4"
          >
            SE CONNECTER
          </button>
          
          <div className="text-center pt-4">
            <a href="#" className="text-[10px] font-bold tracking-widest text-darkBrown/40 hover:text-darkBrown transition-colors">MOT DE PASSE OUBLIÉ ?</a>
          </div>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-sm text-darkBrown/60">
            Pas encore de compte ? <a href="#" className="text-darkBrown font-bold">Demander l'accès</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
