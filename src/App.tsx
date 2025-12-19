import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Predictions from './pages/Predictions';
import RetentionPlans from './pages/RetentionPlans';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useApp();
  if (!authState.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/predictions" 
            element={
              <ProtectedRoute>
                <Predictions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/retention-plans" 
            element={
              <ProtectedRoute>
                <RetentionPlans />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      <footer className="py-20 px-6 border-t border-darkBrown/10 text-center">
         <div className="text-4xl font-script text-darkBrown/30 mb-6">zoroRH</div>
         <p className="text-[10px] font-bold tracking-[0.4em] text-darkBrown/40 uppercase">© 2024 INTELLIGENCE RH zororh. TOUS DROITS RÉSERVÉS.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;