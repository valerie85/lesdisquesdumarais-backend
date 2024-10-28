const mongoose = require('mongoose');

const formatSchema = new mongoose.Schema({
    name: { type: String },
});

const Format = mongoose.model('formats', formatSchema);


module.exports = Format;