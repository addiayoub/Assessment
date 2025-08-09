const User = require('../models/User');

// Middleware pour vérifier l'authentification
const requireAuth = async (req, res, next) => {
  try {
    // Vérifier la session
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Connexion requise'
      });
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Droits administrateur requis'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Middleware optionnel pour charger l'utilisateur si connecté
const loadUser = async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Erreur loadUser:', error);
    next();
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  loadUser
};