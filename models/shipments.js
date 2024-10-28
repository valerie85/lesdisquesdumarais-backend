const mongoose = require('mongoose');


const shipmentSchema = new mongoose.Schema({
    shipment_operator: { type: [String] },
    continent: { type: String },
    country: { type: String },
    shipment_price: { type: String },
});

const Shipment = mongoose.model('shipments', shipmentSchema);


module.exports = Shipment;