import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, BookOpen, FileText, BarChart2 } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import authService from '../services/authService';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [panelAnimate, setPanelAnimate] = useState('enter');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const icons = [
    { icon: <ClipboardList size={48} className="text-orange-500" />, text: "Questionnaire personnalisé" },
    { icon: <BookOpen size={48} className="text-orange-500" />, text: "Évaluation complète" },
    { icon: <FileText size={48} className="text-orange-500" />, text: "Rapport détaillé" },
    { icon: <BarChart2 size={48} className="text-orange-500" />, text: "Analyse de résultats" }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const isAuthenticated = await authService.initialize();
      if (isAuthenticated) {
        window.location.href = '/dashboard';
      }
    };
    
    checkAuth();

    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const switchAuthMode = () => {
    setPanelAnimate('exit');
    setTimeout(() => {
      setIsLogin(!isLogin);
      setPanelAnimate('enter');
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Presentation Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 to-white items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md space-y-8 text-center"
        >
          <motion.div 
            className="flex justify-center mb-8"
            whileHover={{ y: -5 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <img src="/BRIDGE.jpg" alt="Bridge Logo" className="w-full h-full object-contain" />
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIconIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {icons[currentIconIndex].icon}
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {icons[currentIconIndex].text}
              </h2>
            </motion.div>
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="mt-6 text-lg text-gray-700">
              Découvrez votre potentiel avec notre évaluation personnalisée.
            </p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            En savoir plus
          </motion.button>
        </motion.div>
      </div>

      {/* Right Auth Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <Login 
              key="login"
              onSwitchAuth={switchAuthMode}
              onGoogleLogin={handleGoogleLogin}
              animate={panelAnimate}
            />
          ) : (
            <Register
              key="register"
              onSwitchAuth={switchAuthMode}
              onGoogleLogin={handleGoogleLogin}
              animate={panelAnimate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;