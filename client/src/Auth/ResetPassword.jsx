import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(token, password);
      if (response.success) {
        setSuccess('Votre mot de passe a été réinitialisé avec succès.');
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h2>
            <p className="mt-2 text-gray-600">
              Entrez votre nouveau mot de passe ci-dessous.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nouveau mot de passe"
                required
                minLength="6"
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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-orange-500'
                }`}
                placeholder="Confirmer le mot de passe"
                required
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

            <motion.button
              type="submit"
              disabled={loading || !token || password !== confirmPassword}
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
              {loading ? 'En cours...' : 'Réinitialiser le mot de passe'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;