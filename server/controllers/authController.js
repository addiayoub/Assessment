// controllers/authController.js
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
} = require('../services/emailService');

// Fonction utilitaire pour générer un JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Inscription manuelle
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation des données
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer un token de vérification email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Créer le nouvel utilisateur
    const user = new User({
      name,
      email,
      password,
      emailVerificationToken
    });

    await user.save();

    // Envoyer l'email de vérification
    try {
      await sendVerificationEmail(user, emailVerificationToken);
      console.log('Email de vérification envoyé avec succès');
    } catch (emailError) {
      console.log('Erreur envoi email de vérification:', emailError);
      // On continue même si l'email échoue
    }

    // Créer une session
    req.session.userId = user._id;

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.',
      user: user.toPublicJSON(),
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte'
    });
  }
};

// Connexion manuelle
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Mettre à jour la dernière connexion
    const isFirstLogin = !user.lastLogin;
    user.lastLogin = new Date();
    await user.save();

    // Envoyer email de bienvenue si c'est la première connexion ET que l'email est vérifié
    if (isFirstLogin && user.emailVerified) {
      try {
        await sendWelcomeEmail(user, false);
        console.log('Email de bienvenue envoyé');
      } catch (emailError) {
        console.log('Erreur envoi email de bienvenue:', emailError);
      }
    }

    // Configurer la session
    req.session.userId = user._id;
    
    // Si "se souvenir de moi" est coché, prolonger la session
    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
    }

    res.json({
      success: true,
      message: 'Connexion réussie',
      user: user.toPublicJSON(),
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// Déconnexion
const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la déconnexion'
        });
      }
      
      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Déconnexion réussie'
      });
    });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion'
    });
  }
};

// Vérifier l'email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide'
      });
    }

    const wasAlreadyVerified = user.emailVerified;
    
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    // Envoyer email de bienvenue seulement si ce n'était pas déjà vérifié
    if (!wasAlreadyVerified) {
      try {
        await sendWelcomeEmail(user, false);
        console.log('Email de bienvenue envoyé après vérification');
      } catch (emailError) {
        console.log('Erreur envoi email de bienvenue:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Email vérifié avec succès'
    });
  } catch (error) {
    console.error('Erreur vérification email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
};

// Renvoyer l'email de vérification
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà vérifié'
      });
    }

    // Générer un nouveau token si nécessaire
    if (!user.emailVerificationToken) {
      user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      await user.save();
    }

    // Renvoyer l'email de vérification
    try {
      await sendVerificationEmail(user, user.emailVerificationToken);
      
      res.json({
        success: true,
        message: 'Email de vérification renvoyé avec succès'
      });
    } catch (emailError) {
      console.error('Erreur renvoi email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      });
    }
  } catch (error) {
    console.error('Erreur resendVerificationEmail:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Demande de réinitialisation de mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Pour la sécurité, on renvoie toujours un message de succès
      return res.json({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Envoyer l'email de réinitialisation
    try {
      await sendPasswordResetEmail(user, resetToken);
      
      res.json({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation'
      });
    } catch (emailError) {
      console.error('Erreur envoi email reset:', emailError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de réinitialisation'
      });
    }
  } catch (error) {
    console.error('Erreur requestPasswordReset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de réinitialisation invalide ou expiré'
      });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // Envoyer email de confirmation
    try {
      await sendPasswordResetConfirmation(user);
      console.log('Email de confirmation reset envoyé');
    } catch (emailError) {
      console.log('Erreur envoi email confirmation:', emailError);
    }

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation'
    });
  }
};

// Obtenir l'utilisateur actuel
const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  getCurrentUser
};