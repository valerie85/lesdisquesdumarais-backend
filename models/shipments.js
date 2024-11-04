const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    shipment_operator: { type: [String], required: true },
    continent: { type: String, required: true },
    country: { type: String, required: true },
    shipment_price: {
        type: [
            {
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            }], 
            required: true
    },
});


const Shipment = mongoose.model('shipments', shipmentSchema);


module.exports = Shipment;