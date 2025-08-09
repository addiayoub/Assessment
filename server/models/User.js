const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Mot de passe requis seulement si pas d'authentification Google
    },
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  googleId: {
    type: String,
    sparse: true // Permet les valeurs null/undefined multiples
  },
  avatar: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  questionnaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire'
  }],
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    emailVerified: this.emailVerified,
    role: this.role,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

// Méthode statique pour trouver ou créer un utilisateur Google
userSchema.statics.findOrCreateGoogleUser = async function(profile) {
  try {
    // Chercher d'abord par googleId
    let user = await this.findOne({ googleId: profile.id });
    
    if (user) {
      // Mettre à jour les informations si nécessaire
      user.name = profile.displayName;
      user.avatar = profile.photos?.[0]?.value;
      user.emailVerified = true;
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    // Chercher par email si pas trouvé par googleId
    user = await this.findOne({ email: profile.emails?.[0]?.value });
    
    if (user) {
      // Lier le compte Google à l'utilisateur existant
      user.googleId = profile.id;
      user.avatar = user.avatar || profile.photos?.[0]?.value;
      user.emailVerified = true;
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    // Créer un nouvel utilisateur
    user = new this({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      avatar: profile.photos?.[0]?.value,
      emailVerified: true,
      lastLogin: new Date()
    });
    
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Middleware de validation personnalisée
userSchema.pre('validate', function(next) {
  if (!this.googleId && !this.password) {
    this.invalidate('password', 'Le mot de passe est requis pour les comptes non-Google');
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;