const mongoose = require('mongoose');

const adresseSchema = new mongoose.Schema({
    line1: { type: String },
    line2: { type: String },
    line3: { type: String },
    zip_code: { type: String },
    city: { type: String },
    country: { type: String },
    infos: { type: String },
});

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBan: { type: Boolean, default: false },
    inscription_date: { type: Date, default: Date.now },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
    adresses: [adresseSchema],
    resetToken: { type: String }, 
    resetTokenExpiration: { type: Date }
});

const User = mongoose.model('users', userSchema);

module.exports = User;