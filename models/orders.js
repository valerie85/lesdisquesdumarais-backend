const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    order_date: { type: Date, default: Date.now},
    total: { type: Number, required: true },
    shipment_operator: { type: String, required: true },
    shipment_price: { type: Number, required: true },
    shipping_adresse: { type: String, required: true },
    payment_media: { type: String, required: true },
    order_status: { type: String, default: 'Pending' },
    articles: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }], required: true },
    expedition_date: { type: Date, default: null },
    tracking_number: { type: String, default: null },
    isPaid: { type: Boolean, default: false },
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;