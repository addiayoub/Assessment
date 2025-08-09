import { motion } from 'framer-motion';
import { MailCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setStatus('verified');
        } else {
          setError(response.message || 'Échec de la vérification');
          setStatus('failed');
        }
      } catch (err) {
        setError(err.message || 'Une erreur est survenue');
        setStatus('failed');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Token de vérification manquant');
      setStatus('failed');
    }
  }, [token]);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
        >
          {status === 'verifying' && (
            <div className="space-y-6">
              <Loader2 className="w-12 h-12 mx-auto text-orange-500 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900">Vérification en cours</h2>
              <p className="text-gray-600">Nous vérifions votre adresse email...</p>
            </div>
          )}

          {status === 'verified' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="bg-orange-100 p-4 rounded-full">
                  <MailCheck className="w-12 h-12 text-orange-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Email vérifié avec succès!</h2>
              <p className="text-gray-600">
                Votre adresse email a été confirmée. Vous pouvez maintenant accéder à toutes les fonctionnalités.
              </p>
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-all"
              >
                Accéder au tableau de bord
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.a>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Échec de la vérification</h2>
              <p className="text-gray-600">{error}</p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="inline-block px-6 py-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Se connecter
                </a>
                <a
                  href="/register"
                  className="inline-block px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Créer un compte
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification;