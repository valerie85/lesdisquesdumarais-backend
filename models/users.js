const mongoose = require('mongoose');

const adresseSchema = new mongoose.Schema({
    line1: { type: String, required: true },
    line2: { type: String },
    line3: { type: String },
    zip_code: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    infos: { type: String },
});

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    inscription_date: { type: Date, default: Date.now },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
    adresses: [adresseSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;