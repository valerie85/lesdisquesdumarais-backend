var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Article = require('../models/articles');

const saveArticlesToDatabase = async (jsonData) => {
  // filtre et formate le fichier json
  const articlesToSave = jsonData.map(item => ({
    artist: item.artist,
    title: item.title,
    genre: item.genre || null,  // il y a pas de genre sur le fichier
    label: item.label,
    format: item.format,
    price: item.price ? item.price.toString() : null,
    weight: item.weight,
    comments: item.comments || "",
    year: item.listed ? new Date(item.listed).getFullYear().toString() : null,
    media_condition: item.media_condition || "",
    sleeve_condition: item.sleeve_condition || "",
    tracklist: item.tracklist || [],
    createdAt: item.listed ? new Date(item.listed) : Date.now(),
    selling_Date: '',
    isArchived: false,  // false par défaut
    isSold: false,  // false par défaut
    pictures: item.pictures || []  // vide
  }));

  try {
    await Article.insertMany(articlesToSave);
    console.log('Article sauvegarde.');
  } catch (error) {
    console.error('Erreur :', error);
  }
};


const fs = require('fs');

// lire le fichier json
const data = JSON.parse(fs.readFileSync('./article.json', 'utf8'))

// appel pour save
// pour utilise du decommente la ligne saveArticlesToDatabase(data);
//tu lance nodemon ou yarn start avec ta base de connecter
//saveArticlesToDatabase(data);

module.exports = router;