const mongoose = require('mongoose')    



const articleSchemas = new mongoose.Schema({
    artist:{type:String},
    title:{type:String},
    genre:{type:String},
    label:{type:String},
    format:{type:String},
    price:{type:String},
    weight:{type:String},
    comments:{type:String},
    year:{type:String},
    media_condition:{type:String},
    sleeve_condition:{type:String},
    tracklist:{type:[String]},
    createdAt: { type: Date, default: Date.now },
    selling_Date: {type:Date,default: null},
    isArchived: {type:Boolean},
    isSold: {type:Boolean},
    pictures: {type:[String]},
})

const Article = mongoose.model('Article', articleSchemas)

module.exports= Article