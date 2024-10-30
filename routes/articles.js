var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/connection');
const Article = require('../models/articles');

/* GET articles listing. */
router.get('/', function (req, res) {
    Article.find()
        .populate('tracklist')
        .sort({ createdAt: 'desc' })
        .then(articlesData => {
            if (articlesData) {
                res.json({ result: true, allArticles: articlesData });
            } else {
                res.json({ result: false, error :'Articles not found'});
            }
        });
});

//GET one Article infos by release_id pour l'affichage d'un article
router.get('/byrelease/:release_id', function (req, res) {
    Article.findOne({ release_id: req.params.release_id })
        .populate('tracklist')
        .then(articleData => {
            if (articleData) {
                res.json({ result: true, article: articleData });
            } else {
                res.json({ result: false, error :'Release not found'});
            }
        });
});

//GET All Articles infos by artist
router.get('/byartist/:artist', function (req, res) {
    Article.find({ artist: { $regex: new RegExp(req.params.artist, 'i') } })
        .sort({ createdAt: 'desc' })
        .then(articlesData => {
            console.log(articlesData)
            if (articlesData) {
                res.json({ result: true, artistArticles: articlesData });
            } else {
                res.json({ result: false, error :'Artist not found'});
            }
        });
});
//GET All Articles infos by genre
router.get('/bygenre/:genre', function (req, res) {
    let genreName = req.params.genre.replace(/_/g, '/');
    Article.find({ genre: { $regex: new RegExp(genreName, 'i') } })
        .sort({ createdAt: 'desc' })
        .then(genreData => {
            console.log("genreData", genreData)
             if (genreData) {
                res.json({ result: true, genreArticles: genreData });
            } else {
                res.json({ result: false, error :'Genre not found'});
            }
        });
});

module.exports = router;