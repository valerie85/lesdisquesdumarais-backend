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
                res.json({ result: false, error: 'Articles not found' });
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
                res.json({ result: false, error: 'Release not found' });
            }
        });
});

//GET All Articles infos by artist
router.get('/byartist/:artist', function (req, res) {
    Article.find({ artist: { $regex: new RegExp(req.params.artist, 'i') } })
        .sort({ createdAt: 'desc' })
        .then(articlesData => {
            //console.log(articlesData);
            if (articlesData) {
                res.json({ result: true, artistArticles: articlesData });
            } else {
                res.json({ result: false, error: 'Artist not found' });
            }
        });
});
//GET All Articles infos by genre
router.get('/bygenre/:genre', function (req, res) {
    let genreName = req.params.genre.replace(/_/g, '/');
    Article.find({ genre: { $regex: new RegExp(genreName, 'i') } })
        .sort({ createdAt: 'desc' })
        .then(genreData => {
            //console.log("genreData", genreData);
            if (genreData) {
                res.json({ result: true, genreArticles: genreData });
            } else {
                res.json({ result: false, error: 'Genre not found' });
            }
        });
});

//GET All Articles infos by keyword
router.get('/search/:keyword', function (req, res) {
    Article.find({ $or: [ {artist: { $regex: new RegExp(req.params.keyword, 'i') }}, {title: { $regex: new RegExp(req.params.keyword, 'i') }} ] })
        .sort({ createdAt: 'desc' })
        .then(searchData => {
            //console.log("searchData", searchData);
            if (searchData.length>0) {
                res.json({ result: true, searchArticles: searchData });
            } else {
                res.json({ result: false, error: 'Article not found' });
            }
        });
});

router.post('/favorites', async (req, res) => {
    const articleIds = req.body.ids;
  
    try {
      const articles = await Article.find({ _id: { $in: articleIds } });
      res.json({ result: true, articles });
    } catch (error) {
      res.json({ result: false, error: error.message });
    }
  });

router.post('/:articleId/images', async (req, res) => {
    const { articleId } = req.params;
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ result: false, message: "l'url de l'image est manquante" })
    }
    try {
        const updateArticle = await Article.findByIdAndUpdate(
            articleId,
            { $push: { pictures: url } },
            { new: true }
        )
        if (!updateArticle) {
            return res.status(404).json({ message: "article non trouver." });
        }
        res.status(200).json({ restult: true, message: "l'image à bien ete ajouter" })
    } catch (error) {
        res.status(500).json({ result: false, message: "Erreur lors de l'ajout de l'image", details: error.message })
    }
})


router.patch('/:articleId', async(req,res)=>{
    const {articleId} = req.params;
    const {isArchived,selling_Date,comments} = req.body;
    try {
        const updateArticle = await Article.findByIdAndUpdate(
            articleId,
            {isArchived,selling_Date,comments},
            {new:true}
        )
        if(!updateArticle){
            return res.status(404).json({result: false, message:'article non trouver'})
        }
        res.status(200).json({result: false, message:'Article mis à jour avec succes'})
    } catch (error) {
        res.status(500).json({result: false, message:"Erreur lors de l'update de l'article", details:error.message})
    }
})


module.exports = router;