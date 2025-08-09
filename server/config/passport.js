const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configuration de la stratégie Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Utiliser la méthode statique du modèle User
    const user = await User.findOrCreateGoogleUser(profile);
    return done(null, user);
  } catch (error) {
    console.error('Erreur authentification Google:', error);
    return done(error, null);
  }
}));

// Sérialisation de l'utilisateur pour la session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Désérialisation de l'utilisateur depuis la session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;