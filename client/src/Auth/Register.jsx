import { motion } from 'framer-motion';
import { User, Mail, Eye, EyeOff, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import authService from '../services/authService';

const Register = ({ onSwitchAuth, animate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation en temps réel du mot de passe
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Trop court', color: 'text-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Faible', color: 'text-orange-500' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: 'Moyen', color: 'text-yellow-500' };
    return { strength: 4, text: 'Fort', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validations côté client
    if (!name.trim()) {
      setError('Le nom est requis');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('L\'email est requis');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (response.success) {
        setSuccess('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
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

        {success && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center p-4 text-sm text-green-700 bg-green-100 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{success}</span>
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

          {/* Indicateur de force du mot de passe */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Force du mot de passe:</span>
                <span className={`text-sm font-medium ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                    passwordStrength.strength === 2 ? 'bg-orange-500 w-2/4' :
                    passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/4' :
                    passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-orange-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-orange-500'
              }`}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>

          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
          )}

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="block ml-2 text-sm text-gray-900">
              J'accepte les{' '}
              <a href="/terms" className="text-orange-600 hover:text-orange-500 underline">
                conditions d'utilisation
              </a>
              {' '}et la{' '}
              <a href="/privacy" className="text-orange-600 hover:text-orange-500 underline">
                politique de confidentialité
              </a>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !acceptTerms || password !== confirmPassword}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
          onClick={handleGoogleLogin}
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

export default Register;