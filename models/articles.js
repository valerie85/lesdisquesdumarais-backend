const mongoose = require('mongoose');


//modifié et complété pour genre, style et tracklist sur les formats reçus +qq pb de syntaxe
const articleSchema = new mongoose.Schema({
    release_id: { type: String },
    artist: { type: String },
    title: { type: String },
    genre: [{ type: String }],
    style: [{ type: String }],
    label: { type: String },
    format: { type: String },
    price: { type: String },
    weight: { type: String },
    comments: { type: String },
    year: { type: String },
    media_condition: { type: String },
    sleeve_condition: { type: String },
    tracklist: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    selling_Date: { type: Date, default: null },
    isArchived: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    pictures: { type: [String] },
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;