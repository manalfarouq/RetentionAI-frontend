import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';

const Navbar: React.FC = () => {
  const { authState, logout } = useApp();
  const location = useLocation();

  const navLinks = [
    { name: 'ACCUEIL', path: '/' },
    { name: 'SERVICES', path: '#' },
    { name: 'CONTACT', path: '#' },
    { name: 'PRÉDICTIONS', path: '/predictions' },
    { name: 'PLANS DE RÉTENTION', path: '/retention-plans' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex flex-col items-center py-8 px-6 bg-cream border-b border-darkBrown/10 sticky top-0 z-50">
      <div className="text-5xl font-script text-darkBrown mb-6 select-none">zoroRH</div>
      
      <div className="flex items-center gap-10 text-xs font-medium tracking-[0.2em] text-darkBrown/60">
        {navLinks.map(link => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`hover:text-darkBrown transition-colors ${isActive(link.path) ? 'text-darkBrown border-b border-darkBrown pb-1' : ''}`}
          >
            {link.name}
          </Link>
        ))}
        
        {authState.isAuthenticated ? (
          <button 
            onClick={logout}
            className="hover:text-darkBrown transition-colors border border-darkBrown/20 px-4 py-1 rounded-full"
          >
            DÉCONNEXION
          </button>
        ) : (
          <Link to="/login" className="hover:text-darkBrown transition-colors border border-darkBrown/20 px-4 py-1 rounded-full">
            CONNEXION
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;