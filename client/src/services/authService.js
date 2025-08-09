const API_BASE_URL =  import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = null;
    this.isAuthenticated = false;
  }

  // Configuration des requêtes avec credentials
  async fetchWithCredentials(url, options = {}) {
    const config = {
      credentials: 'include', // Important pour les cookies de session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur réseau');
    }
    
    return response.json();
  }

  // Inscription
  async register(userData) {
    try {
      const response = await this.fetchWithCredentials('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  // Connexion
  async login(credentials) {
    try {
      const response = await this.fetchWithCredentials('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success) {
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  }

  // Déconnexion
  async logout() {
    try {
      await this.fetchWithCredentials('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Connexion avec Google
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  // Vérifier le statut d'authentification
  async checkAuthStatus() {
    try {
      const response = await this.fetchWithCredentials('/auth/me');
      
      if (response.success) {
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      this.logout();
    }
    return false;
  }

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    if (this.user) {
      return this.user;
    }

    try {
      const response = await this.fetchWithCredentials('/auth/me');
      if (response.success) {
        this.user = response.user;
        this.isAuthenticated = true;
        return this.user;
      }
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      this.logout();
    }
    return null;
  }

  // Demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const response = await this.fetchWithCredentials('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error('Erreur forgot password:', error);
      throw error;
    }
  }

  // Réinitialisation de mot de passe
  async resetPassword(token, newPassword) {
    try {
      const response = await this.fetchWithCredentials('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      return response;
    } catch (error) {
      console.error('Erreur reset password:', error);
      throw error;
    }
  }

  // Vérification d'email
  async verifyEmail(token) {
    try {
      const response = await this.fetchWithCredentials(`/auth/verify-email?token=${token}`);
      return response;
    } catch (error) {
      console.error('Erreur vérification email:', error);
      throw error;
    }
  }

  // Initialiser le service au chargement
  async initialize() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = JSON.parse(storedUser);
      this.isAuthenticated = true;

      // Vérifier si le token est toujours valide
      const isValid = await this.checkAuthStatus();
      if (!isValid) {
        this.logout();
      }
    }

    return this.isAuthenticated;
  }

  // Getters
  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isAuth() {
    return this.isAuthenticated;
  }
}

// Créer une instance singleton
const authService = new AuthService();

export default authService;