var express = require('express');
var router = express.Router();
const Order = require('../models/orders');


//Route pour une nouvelle commande

router.post('/', async (req, res) => {
    //recup des données
    const {
        user, total, shipment_operator,
        shipment_price, shipping_adresse, payment_media, articles, isPaid
    } = req.body;
    // save données
    try {
        const newOrder = new Order({
            user,
            total,
            shipment_operator,
            shipment_price,
            shipping_adresse,
            payment_media,
            articles,
            isPaid,
        });
        const savedOrder = await newOrder.save();
        const populatedOrder = await savedOrder.populate('articles');
        //objet filtrée
        const returnOrder = {
            _id: populatedOrder._id,
            user: populatedOrder.user,
            shipment_price: populatedOrder.shipment_price,
            payment_media: populatedOrder.payment_media,
            total: populatedOrder.total,
            order_status: populatedOrder.order_status,
            order_date: populatedOrder.order_date,
        };
        res.status(200).json({ result: true, order: returnOrder })
    } catch (error) {
        res.status(500).json({ result: false, error: 'Failed to save.', details: error.message })
    }
})

router.get('/expedition', async (req, res) => {
    try {
        const pendingOrders = await Order.find({ order_status: "Pending" });

        if (pendingOrders.length > 0) {
            res.status(200).json({ result: true, orders: pendingOrders })
        } else {
            res.status(404).json({ result: false, message: 'no orders to ship' })
        }
    } catch (error) {
        res.status(500).json({ result: false, message: "server error", details: error.message })
    }
})

router.patch('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { tracking_number, order_status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { order_status, expedition_date: order_status === "Shipped" ? Date.now() : null, tracking_number },
            { new: true });

        if (updatedOrder) {
            res.json({ result: true, order: updatedOrder })
        } else {
            res.status(404).json({ result: false, error: 'Order not found' })
        }
    } catch (error) {
        res.status(500).json({ result: false, error: 'failed to update order', details: error.message })
    }
})


router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('articles');
        if (orders.length > 0) {
            res.status(200).json({ result: true, orders })
        } else {
            res.status(404).json({ result: false, error: ' no orders found for user' })
        }
    } catch (error) {
        res.status(500).json({ result: false, error: 'Failed to get orders', details: error.message })
    }
})


module.exports = router;
