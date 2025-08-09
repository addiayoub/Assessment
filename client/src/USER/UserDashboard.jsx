import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Edit, LogOut, ClipboardList, BarChart2 } from 'lucide-react';
import authService from '../services/authService';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ici vous ajouteriez la logique pour mettre à jour le profil
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-600">Assessment Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-orange-600"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full mb-3">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <User className="w-5 h-5 mr-2" />
                Profil
              </button>
              <button
                onClick={() => setActiveTab('questionnaires')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'questionnaires' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Questionnaires
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'results' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Résultats
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'security' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Lock className="w-5 h-5 mr-2" />
                Sécurité
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Informations du profil</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center text-orange-600 hover:text-orange-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut du compte</p>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span>{user.emailVerified ? 'Vérifié' : 'Non vérifié'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'questionnaires' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Mes questionnaires</h2>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                  <p className="text-orange-700">Vous n'avez pas encore complété de questionnaire.</p>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Commencer un nouveau questionnaire
                </button>
              </div>
            )}

            {activeTab === 'results' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Mes résultats</h2>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <p className="text-orange-700">Aucun résultat disponible pour le moment.</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Sécurité du compte</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-600 mb-3">Mettez à jour votre mot de passe régulièrement pour assurer la sécurité de votre compte.</p>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Modifier le mot de passe
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-2">Connexions actives</h3>
                    <p className="text-sm text-gray-600 mb-3">Vous êtes actuellement connecté sur cet appareil.</p>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Connecté maintenant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;