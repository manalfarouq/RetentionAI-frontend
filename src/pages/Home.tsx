import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-fadeIn">
      <header className="text-center mb-24">
        <h2 className="text-xs font-medium tracking-[0.4em] text-darkBrown/50 mb-6 uppercase">Prédictif. Basé sur les données.</h2>
        <h1 className="font-serif text-8xl md:text-9xl text-darkBrown leading-tight mb-8">
          Intelligence de <br />
          <span className="italic">Rétention RH</span>
        </h1>
        <p className="font-sans text-lg text-darkBrown/60 tracking-wide max-w-2xl mx-auto mb-12">
          Exploiter l'intelligence avancée pour cultiver des relations intentionnelles, uniques et durables avec vos employés. Nous vous aidons à anticiper.
        </p>
        <Link 
          to="/predictions" 
          className="inline-block bg-darkBrown text-cream px-10 py-5 text-xs font-bold tracking-widest hover:bg-sage transition-colors rounded-full"
        >
          CONTACTEZ-NOUS DÈS AUJOURD'HUI !
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="aspect-[4/5] bg-sage relative overflow-hidden rounded-lg shadow-2xl">
          <img 
            src="https://picsum.photos/800/1000?random=1" 
            alt="Ambiance bureau" 
            className="w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 border-[20px] border-cream/20 m-4 pointer-events-none"></div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="font-serif text-4xl italic text-darkBrown">Maîtrise Prédictive</h3>
            <p className="text-darkBrown/70 leading-relaxed font-light text-lg">
              Notre algorithme unique analyse plus de 50 points de données par employé pour prévoir les départs potentiels avant qu'ils ne surviennent. Ce ne sont pas que des données ; c'est de la prévoyance.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-4xl italic text-darkBrown">Plans Artisanaux</h3>
            <p className="text-darkBrown/70 leading-relaxed font-light text-lg">
              Chaque employé est unique. Nos plans de rétention sont élaborés par IA pour correspondre aux besoins individuels, aux aspirations et aux trajectoires de performance.
            </p>
          </div>
          <div className="pt-8 grid grid-cols-2 gap-8 text-[10px] font-bold tracking-[0.2em] text-darkBrown/40 uppercase">
             <div className="border-t border-darkBrown/10 pt-4">01. ANALYSE</div>
             <div className="border-t border-darkBrown/10 pt-4">02. PRÉDICTION</div>
             <div className="border-t border-darkBrown/10 pt-4">03. STRATÉGIE</div>
             <div className="border-t border-darkBrown/10 pt-4">04. ACTION</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;