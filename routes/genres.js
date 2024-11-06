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

/* GET genre description. */
router.get('/:genre', function (req, res) {
    let genreName = req.params.genre.replace(/_/g, '/');
    Genre.findOne({ name: { $regex: new RegExp(genreName, 'i') } })
        .then(genreData => {
            if (genreData) {
                res.json({ result: true, description: genreData.description });
            } else {
                res.json({ result: false, error :'Genre not found'});
            }
        });
});

module.exports = router;