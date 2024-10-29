var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      const email = req.body.email

      if (emailPattern.test(email)) {
        res.json({ message: "Email valide" })
      } else {
        res.json({ message: "Email non valide" })
      }

      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
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
      res.json({ result: true, token: data.token, message: "L'utilisteur est bien connecté" });
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
});

//getId
router.get('/id', async (req, res) => {
  const token = req.headers.authorization

  try {
    const user = await User.findOne({ token });
    if (user) {
      res.json({ result: true, _id: user._id, isAdmin: user.isAdmin })
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


module.exports = router;


