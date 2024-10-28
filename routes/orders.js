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

        //objet filtrée
        const returnOrder = {
            _id: savedOrder._id,
            user: savedOrder.user,
            shipment_price: savedOrder.shipment_price,
            payment_media: savedOrder.payment_media,
            total: savedOrder.total,
            order_status: savedOrder.order_status,
            order_date: savedOrder.order_date,
        };

        res.status(200).json({ result: true, order: returnOrder })
    } catch (error) {
        res.status(500).json({ result: false, error: 'Failed to save.', error })
    }
})


router.patch('/:id', async (req, res) => {
    const { expedition_date, tracking_number } = req.body;
 
    try {
       const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id, 
        { expedition_date: Date.now(), tracking_number }, 
        { new: true });

        if(updatedOrder){
            res.json({result: true, order: updatedOrder})
        }else{
            res.status(404).json({result: false, error: 'Order not found'})
        }
    } catch (error) {
res.status(500).json({result:false, error: 'failed to update order'})
    }
})


router.get('/:userId' , async (req,res)=>{
    try {
        const orders = await Order.find({user:req.params.userId});
        if (orders.length > 0) {
            res.statut(200).
        }
    } catch (error) {
        
    }
})


module.exports = router;
