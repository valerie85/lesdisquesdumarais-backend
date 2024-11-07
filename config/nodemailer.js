// config/nodemailer.js
const nodemailer = require('nodemailer');

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD 
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Fonction de test de connexion
const verifyConnection = async () => {
  try {
    const verify = await transporter.verify();
    console.log('Connexion SMTP établie:', verify);
    return verify;
  } catch (error) {
    console.error('Erreur de connexion SMTP:', error);
    throw error;
  }
};

// Fonction d'envoi d'email
const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    throw error;
  }
};

module.exports = {
  transporter,
  verifyConnection,
  sendEmail
};