import { useState, useEffect } from 'react';
import ModernQuestionnaireLoader from './Loader/ModernQuestionnaireLoader';
import AuthPage from './Auth/AuthPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    console.log('Utilisateur connecté avec succès');
  };

  if (showLoader) {
    return <ModernQuestionnaireLoader />;
  }

  return (
    <div className="App">
      {!isAuthenticated ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-orange-600 mb-4">Bienvenue dans Assessment</h1>
            <p className="text-gray-700 mb-6">Vous êtes maintenant connecté à votre espace questionnaire.</p>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;