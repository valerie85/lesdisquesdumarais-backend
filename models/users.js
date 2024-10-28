const mongoose = require('mongoose');

const adresseSchema = new mongoose.Schema({
    line1: { type: String, require: true },
    line2: { type: String },
    line3: { type: String },
    zip_code: { type: Number, require: true },
    city: { type: String, require: true },
    country: { type: String, require: true },
    infos: { type: String },
});

const userSchema = new mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean },
    inscription_date: { type: Date, default: Date.now },
    favorites: [{type:mongoose.Schema.Types.ObjectId, ref: 'articles'}],
    adresses: [adresseSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;