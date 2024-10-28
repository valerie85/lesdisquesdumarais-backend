var express = require('express');
var router = express.Router();
const Order = require('../models/orders');


//Route pour une nouvelle commande

router.post('/orders', async (req, res) => {
    const {
        user,total,shipment_operator,
        shipment_price,shipment_adresse,payment_media,order_status,article,isPaid
    } = req.body;
try {
   const newOrder = new Order({
    user,
    total,
    shipment_operator,
    shipment_price,
    shipment_adresse,
    payment_media,
    order_status,
    article,
    isPaid,
   });

  const savedOrder = await newOrder.save();
    res.status(200).json({ result:true,  })
} catch (error) {
    
}


})


module.exports = router;
