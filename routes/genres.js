var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/genres');
const Genre = require('../models/genres');

/* GET genres listing. */
router.get('/', function (req, res) {
    Genre.find()
        .then(genresData => {
            if (genresData) {
                res.json({ result: true, allGenres: genresData });
            } else {
                res.json({ result: false, error :'Genres not found'});
            }
        });
});

module.exports = router;