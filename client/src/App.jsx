import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModernQuestionnaireLoader from './Loader/ModernQuestionnaireLoader';
import AuthPage from './Auth/AuthPage';
import EmailVerification from './Auth/EmailVerification';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import UserDashboard from './USER/UserDashboard';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const authStatus = await authService.initialize();
      setIsAuthenticated(authStatus);
      setIsInitializing(false);
      
      // Cache le loader après 3 secondes ou une fois l'authentification initialisée
      setTimeout(() => {
        setShowLoader(false);
      }, 3000);
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isInitializing || showLoader) {
    return <ModernQuestionnaireLoader />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route publique - Page d'authentification */}
          <Route 
            path="/auth" 
            element={
              !isAuthenticated ? (
                <AuthPage onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          {/* Route de vérification d'email */}
          <Route path="/verify-email" element={<EmailVerification />} />
                    <Route path="/login" element={<AuthPage />} />

          {/* Mot de passe oublié */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Tableau de bord privé */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <UserDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
          
          {/* Route par défaut */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;