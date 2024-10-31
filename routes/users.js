var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Article = require('../models/articles');
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

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
        res.json({ result: true, token: newDoc.token, email: newDoc.email });
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
      res.json({ result: true, _id: user._id, isAdmin: user.isAdmin, favorites: user.favorites })
    } else {
      res.status(404).json({ result: false, message: 'user not found' })
    }
  } catch (error) {
    res.status(500).json({ result: false, message: 'Error server', details: error.message })
  }
})

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


module.exports = router;


