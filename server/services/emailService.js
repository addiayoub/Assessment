// services/emailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Templates d'emails
const emailTemplates = {
  // Email de vérification
  verification: (name, verificationUrl) => ({
    subject: 'Vérifiez votre compte Bridge',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification de compte</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌉 Bridge</h1>
            <h2>Vérifiez votre compte</h2>
          </div>
          <div class="content">
            <h3>Bonjour ${name} !</h3>
            <p>Merci de vous être inscrit sur <strong>Bridge</strong>. Pour compléter votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            </div>
            <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            <p><strong>Note :</strong> Ce lien expire dans 24 heures.</p>
            <p>Si vous n'avez pas créé de compte sur Bridge, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Bridge. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email de bienvenue
  welcome: (name, isGoogleAuth = false) => ({
    subject: 'Bienvenue sur Bridge ! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur Bridge</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌉 Bridge</h1>
            <h2>Bienvenue ${name} !</h2>
          </div>
          <div class="content">
            <h3>Félicitations ! 🎉</h3>
            <p>Votre compte Bridge a été ${isGoogleAuth ? 'créé via Google' : 'créé et vérifié'} avec succès ! Nous sommes ravis de vous accueillir dans notre communauté.</p>
            
            <h4>Que pouvez-vous faire maintenant ?</h4>
            
            <div class="feature">
              <h5>📊 Créer des questionnaires</h5>
              <p>Concevez facilement des questionnaires personnalisés pour collecter des données.</p>
            </div>
            
            <div class="feature">
              <h5>📈 Analyser les résultats</h5>
              <p>Visualisez et analysez les réponses avec nos outils intégrés.</p>
            </div>
            
            <div class="feature">
              <h5>🤝 Collaborer</h5>
              <p>Partagez vos questionnaires et collaborez avec votre équipe.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/dashboard" class="button">Commencer maintenant</a>
            </div>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider !</p>
            
            <p>Bonne exploration ! 🚀</p>
            
            <p><strong>L'équipe Bridge</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Bridge. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email de réinitialisation de mot de passe
  passwordReset: (name, resetUrl) => ({
    subject: 'Réinitialisation de votre mot de passe Bridge',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌉 Bridge</h1>
            <h2>Réinitialisation de mot de passe</h2>
          </div>
          <div class="content">
            <h3>Bonjour ${name},</h3>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Bridge.</p>
            
            <div class="warning">
              <strong>⚠️ Important :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
            </div>
            
            <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⏰ Attention :</strong> Ce lien expire dans <strong>1 heure</strong> pour votre sécurité.
            </div>
            
            <p>Après avoir cliqué sur le lien, vous pourrez créer un nouveau mot de passe sécurisé.</p>
            
            <p>Si vous avez des questions ou des préoccupations, contactez notre support.</p>
            
            <p>Cordialement,<br><strong>L'équipe Bridge</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Bridge. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email de confirmation de réinitialisation
  passwordResetConfirmation: (name) => ({
    subject: 'Mot de passe modifié avec succès',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe modifié</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌉 Bridge</h1>
            <h2>✅ Mot de passe modifié</h2>
          </div>
          <div class="content">
            <h3>Bonjour ${name},</h3>
            
            <div class="success">
              <strong>✅ Succès !</strong> Votre mot de passe a été modifié avec succès.
            </div>
            
            <p>Votre mot de passe Bridge a été mis à jour le ${new Date().toLocaleString('fr-FR')}.</p>
            
            <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            
            <p><strong>Pour votre sécurité :</strong></p>
            <ul>
              <li>Gardez votre mot de passe confidentiel</li>
              <li>Utilisez un mot de passe unique pour Bridge</li>
              <li>Activez l'authentification à deux facteurs si disponible</li>
            </ul>
            
            <p>Si vous n'avez pas effectué cette modification, contactez immédiatement notre support.</p>
            
            <p>Cordialement,<br><strong>L'équipe Bridge</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Bridge. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Fonctions d'envoi d'emails
const sendEmail = async (to, template, data) => {
  try {
    // Créer le transporter à chaque envoi
    const transporter = createTransporter();
    
    // Générer le contenu de l'email
    const emailContent = template(data.name, ...Object.values(data).slice(1));
    
    const mailOptions = {
      from: `"Bridge App" <${process.env.SMTP_EMAIL}>`, // Correction: utiliser SMTP_EMAIL au lieu de SMTP_USER
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    console.log('Tentative d\'envoi email vers:', to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.message };
  }
};

// Fonctions spécialisées pour chaque type d'email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  return await sendEmail(user.email, emailTemplates.verification, {
    name: user.name,
    verificationUrl
  });
};

const sendWelcomeEmail = async (user, isGoogleAuth = false) => {
  return await sendEmail(user.email, emailTemplates.welcome, {
    name: user.name,
    isGoogleAuth
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  return await sendEmail(user.email, emailTemplates.passwordReset, {
    name: user.name,
    resetUrl
  });
};

const sendPasswordResetConfirmation = async (user) => {
  return await sendEmail(user.email, emailTemplates.passwordResetConfirmation, {
    name: user.name
  });
};

// Fonction de test de la configuration email
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Configuration email valide ✅');
    return true;
  } catch (error) {
    console.error('Erreur configuration email ❌:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
  testEmailConfiguration
};