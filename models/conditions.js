const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
    name: { type: String },
});

const Condition = mongoose.model('conditions', conditionSchema);


module.exports = Condition;