const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Routes d'authentification manuelle
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Routes de gestion du mot de passe
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);

// Route pour obtenir l'utilisateur actuel
router.get('/me', requireAuth, authController.getCurrentUser);

// Routes Google OAuth
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed` 
  }),
  (req, res) => {
    // Authentification Google réussie
    req.session.userId = req.user._id;
    
    // Rediriger vers le frontend avec succès
    res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`);
  }
);

// Route de test de session
router.get('/test-session', (req, res) => {
  res.json({
    session: req.session,
    user: req.user,
    isAuthenticated: !!req.session.userId
  });
});

// Route pour vérifier le statut d'authentification
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({
      success: true,
      authenticated: true,
      userId: req.session.userId
    });
  } else {
    res.json({
      success: true,
      authenticated: false
    });
  }
});

module.exports = router;