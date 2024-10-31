const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
});

const Genre = mongoose.model('genres', genreSchema);


module.exports = Genre;