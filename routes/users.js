var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Article = require('../models/articles');
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { sendEmail } = require('../config/nodemailer');


// Configurer le transporteur d'e-mails pour Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou un autre service SMTP
  auth: {
    user: process.env.EMAIL_USER, // Utiliser des variables d'environnement pour la sécurité
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/signup", (req, res) => {
  
  if (!checkBody(req.body, ["firstName","lastName", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

      const email = req.body.email

      if(emailPattern.test(email)) {
        console.log({ message: "Email valide"})
      } else {
        console.log({ message: "Email non valide"})
      } 
      const newUser = new User({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token, email: newDoc.email, firstName: newDoc.firstname });
      });
    } else {
      res.json({ result: false, error: "Cet utilisateur existe déjà" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing of empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "Identifiant ou mot de passe introuvable",});
      return;
    }
    
     if (data.isBan) {
       res.json({ result: false, error: "Utilisateur banni" });
       return;
     }

    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, firstName: data.firstname, email: data.email, message: "L'utilisateur est bien connecté" });
    } else {
      res.json({
        result: false,
        error: "Identifiant ou mot de passe introuvable",
      });
    }
  });
});

/* GET users listing. */
router.get('/', (req, res) => {
  User.find({})
    .then((data) => {
      res.json({ result: true, users: data });
    })
    .catch((err) => {
      res.json({ result: false, error: err.message })
    })
    .then((data) => {
      res.json({ result: true, users: data });
    })
    .catch((err) => {
      res.json({ result: false, error: err.message })
    })
});

//getId
router.get('/id', async (req, res) => {
  const token = req.headers.authorization
  try {
    const user = await User.findOne({ token }).populate('favorites');

    if (user) {
      const userResponse = {
        result: true,
        _id: user._id,
        isAdmin: user.isAdmin,
        favorites: user.favorites,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        addresses: user.adresses
      };
      res.json(userResponse);
    } else {
      res.status(404).json({ result: false, message: 'Utilisateur non trouvé' });
    }  

  } catch (error) {
    res.status(500).json({ result: false, message: 'Error server', details: error.message })
  }
})


// Route pour supprimer une adresse
router.delete('/delete-address', async (req, res) => {
  try {
    const { userId, addressIndex } = req.body;
    
    console.log("Données reçues:", { userId, addressIndex });

    // Validation des entrées
    if (!userId || addressIndex === undefined) {
      return res.status(400).json({ 
        result: false, 
        message: "L'ID de l'utilisateur et l'index de l'adresse sont requis." 
      });
    }

    const user = await User.findById(userId.toString());

    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      return res.status(404).json({ 
        result: false, 
        message: "Utilisateur non trouvé." 
      });
    }

    // Vérification de l'existence des adresses
    if (!Array.isArray(user.adresses)) {
      return res.status(400).json({ 
        result: false, 
        message: "Le tableau d'adresses n'existe pas." 
      });
    }

    console.log("Nombre d'adresses:", user.adresses.length);
    console.log("Index à supprimer:", addressIndex);

    // Vérification de l'index
    if (addressIndex < 0 || addressIndex >= user.adresses.length) {
      return res.status(400).json({ 
        result: false, 
        message: "Index d'adresse invalide." 
      });
    }

    // Suppression de l'adresse
    user.adresses.splice(addressIndex, 1);
    
    // Sauvegarde des modifications
    const savedUser = await user.save();
    console.log("Sauvegarde réussie, nouvelles adresses:", savedUser.adresses.length);

    res.json({ 
      result: true, 
      message: "Adresse supprimée avec succès",
      user: savedUser 
    });
  } catch (error) {
    console.error("Erreur complète lors de la suppression:", error);
    res.status(500).json({ 
      result: false, 
      message: "Erreur serveur lors de la suppression de l'adresse.",
      error: error.message 
    });
  }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const userid = req.params.id
    const deleteUser = await User.findByIdAndDelete(userid)

    res.json({ result: true, message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.json({ result: false, message: 'Utilisateur introuvable' })
  }
});

//Route pour retrouver les infos de l'utilisateur loggé
router.get('/:token', (req, res) => {
  User.findOne({ token: req.params.token })
    .then(data => {
      if (data) {
        res.json({ result: true, userData: data });
      } else {
        res.json({ result: false, message: "pas d'utilisateur avec ce token" })
      }
    });
});

router.put('/like', (req, res) => {
  if (!checkBody(req.body, ['token', 'articleId'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    Article.findById(req.body.articleId).then(articleData => {
      if (!articleData) {
        res.json({ result: false, error: 'Article not found' });
        return;
      }
      if (user.favorites.includes(req.body.articleId)) { // User already liked the article
        User.updateOne({ token: req.body.token }, { $pull: { favorites: req.body.articleId } }) // Remove article ID from likes
          .then(() => {
            res.json({ result: true, message: 'favorite removed' });
          });
      } else { // User has not liked the article
        User.updateOne({ token: req.body.token }, { $push: { favorites :req.body.articleId} }) // Add article ID to likes
          .then(() => {
            res.json({ result: true, message: 'favorite added' });
          });
      }
    });
  });
});

router.put('/adresses/:token', async(req,res)=>{
    User.findOne({ token: req.params.token }).then(user => {
    if (user === null) {
      res.json({ result: false, error: 'User not found' });
      return;
    } else {

      const newAddress ={
        line1: req.body.formState.line1,
        line2: req.body.formState.line2,
        line3: req.body.formState.line3,
        zip_code: req.body.formState.zip_code,
        city: req.body.formState.city,
        country: req.body.formState.country,
        infos: req.body.formState.infos,
      };
      if (!user.adresses.includes(newAddress)) { // User not already saved the address
        User.updateOne({ token: req.params.token }, { $push: { adresses: newAddress} }) 
          .then((addressData) => {
                  res.json({result: true, message:'Adresse enregistrée avec succes'})
                 })
          }
        }
    });    
});




// Route pour modifier les données de l'utilisateur
router.patch('/update-user', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, addresses } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, message: "L'ID de l'utilisateur est requis." });
    }

    const updateFields = {};
    if (firstName) updateFields.firstname = firstName;
    if (lastName) updateFields.lastname = lastName;
    if (email) updateFields.email = email;

    // Si des adresses sont fournies, ajoute-les au champ 'addresses'
    if (addresses && Array.isArray(addresses)) {
      updateFields.addresses = addresses.map(address => ({
        line1: address.line1,
        line2: address.line2,
        line3: address.line3,
        zip_code: address.zip_code,
        city: address.city,
        country: address.country,
        infos: address.infos,
      }));
    }

    // Utilise findByIdAndUpdate pour mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ result: false, message: "Utilisateur non trouvé." });
    }

    res.json({ result: true, message: "Informations mises à jour avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ result: false, message: "Erreur serveur lors de la mise à jour de l'utilisateur." });
  }
});


router.patch('/update-addresses', async (req, res) => {
  try {
    const { userId, addressIndex, address } = req.body;

    if (!userId || addressIndex === undefined || !address) {
      return res.status(400).json({ result: false, message: "L'ID de l'utilisateur, l'index de l'adresse, et les informations de l'adresse sont requis." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ result: false, message: "Utilisateur non trouvé." });
    }

    if (!user.adresses || user.adresses.length <= addressIndex) {
      return res.status(400).json({ result: false, message: "Adresse non trouvée à cet index." });
    }

    user.adresses[addressIndex] = {
      ...user.adresses[addressIndex],
      ...address
    };

    await user.save();

    res.json({ result: true, message: "Adresse mise à jour avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adresse:", error);
    res.status(500).json({ result: false, message: "Erreur serveur lors de la mise à jour de l'adresse." });
  }
});


// Route pour la réinitialisation du mot de passe
router.post('/forgot-password', async (req, res) => {
  try {
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Votre lien de réinitialisation...</p>`
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur d\'envoi d\'email' });
  }
});


// Route pour réinitialiser le mot de passe avec le token
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token et nouveau mot de passe sont requis." });
  }

  try {
    
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Token de réinitialisation invalide ou expiré' });
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    user.password = hash;
    user.resetToken = undefined; // Supprimer le token de réinitialisation
    user.resetTokenExpiration = undefined;
    await user.save();

    
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error("Erreur dans la route reset-password:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;