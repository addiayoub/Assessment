import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ClipboardList, BookOpen, FileText, BarChart2 } from 'lucide-react';

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
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    console.log('Google login');
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

const Register = ({ onSwitchAuth, onGoogleLogin, animate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Register with:', name, email, password);
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={animate === 'enter' ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
      animate={animate === 'enter' ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Créez un compte</h2>
          <p className="mt-2 text-sm text-gray-600">Commencez votre évaluation</p>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </motion.div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="block w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-orange-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-orange-500" />
              )}
            </button>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="terms" className="block ml-2 text-sm text-gray-900">
              J'accepte les <a href="#" className="text-orange-600 hover:text-orange-500">conditions</a>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {loading ? (
                <Loader2 className="w-5 h-5 text-orange-200 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-orange-200 group-hover:text-white transition-transform group-hover:translate-x-1" />
              )}
            </span>
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </motion.button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>

        <motion.button
          onClick={onGoogleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </motion.button>

        <div className="text-sm text-center text-gray-600">
          <span>Déjà un compte? </span>
          <button
            onClick={onSwitchAuth}
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            Se connecter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Login = ({ onSwitchAuth, onGoogleLogin, animate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login with:', email, password);
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={animate === 'enter' ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
      animate={animate === 'enter' ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Connectez-vous</h2>
          <p className="mt-2 text-sm text-gray-600">Accédez à votre questionnaire</p>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </motion.div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="block w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-orange-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-orange-500" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {loading ? (
                <Loader2 className="w-5 h-5 text-orange-200 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-orange-200 group-hover:text-white transition-transform group-hover:translate-x-1" />
              )}
            </span>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </motion.button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>

        <motion.button
          onClick={onGoogleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </motion.button>

        <div className="text-sm text-center text-gray-600">
          <span>Pas encore de compte? </span>
          <button
            onClick={onSwitchAuth}
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;///stp











// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Login from './Login';
// import Register from './Register';
// import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ClipboardList, BookOpen, FileText, BarChart2 } from 'lucide-react';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [panelAnimate, setPanelAnimate] = useState('enter');
//   const [currentIconIndex, setCurrentIconIndex] = useState(0);

//   const icons = [
//     { icon: <ClipboardList size={48} className="text-orange-500" />, text: "Questionnaire personnalisé" },
//     { icon: <BookOpen size={48} className="text-orange-500" />, text: "Évaluation complète" },
//     { icon: <FileText size={48} className="text-orange-500" />, text: "Rapport détaillé" },
//     { icon: <BarChart2 size={48} className="text-orange-500" />, text: "Analyse de résultats" }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIconIndex((prev) => (prev + 1) % icons.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleGoogleLogin = () => {
//     console.log('Google login');
//   };

//   const switchAuthMode = () => {
//     setPanelAnimate('exit');
//     setTimeout(() => {
//       setIsLogin(!isLogin);
//       setPanelAnimate('enter');
//     }, 300);
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-r from-orange-500 to-white overflow-hidden">
//       {/* Left Presentation Panel */}
//       <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-md space-y-8 text-center"
//         >
//           <motion.div 
//             className="flex justify-center mb-8"
//             whileHover={{ y: -5 }}
//           >
//             <div className="bg-white p-6 rounded-2xl shadow-xl">
//               <img src="/BRIDGE.jpg" alt="Bridge Logo" className="w-full h-full object-contain" />
//             </div>
//           </motion.div>
          
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIconIndex}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.5 }}
//               className="flex flex-col items-center"
//             >
//               {icons[currentIconIndex].icon}
//               <h2 className="mt-4 text-xl font-semibold text-gray-800">
//                 {icons[currentIconIndex].text}
//               </h2>
//             </motion.div>
//           </AnimatePresence>
          
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//             className="bg-gradient-to-r from-orange-400 to-orange-100 p-6 rounded-xl"
//           >
//             <p className="text-lg text-white">
//               Découvrez votre potentiel avec notre évaluation personnalisée.
//             </p>
//           </motion.div>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="mt-6 inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
//           >
//             En savoir plus
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Right Auth Panel */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8">
//         <AnimatePresence mode="wait">
//           {isLogin ? (
//             <Login 
//               key="login"
//               onSwitchAuth={switchAuthMode}
//               onGoogleLogin={handleGoogleLogin}
//               animate={panelAnimate}
//             />
//           ) : (
//             <Register 
//               key="register"
//               onSwitchAuth={switchAuthMode}
//               onGoogleLogin={handleGoogleLogin}
//               animate={panelAnimate}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;