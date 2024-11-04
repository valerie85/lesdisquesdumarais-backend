var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/shipments');
const Shipment = require('../models/shipments');

/* GET Shipment listing. */
router.get('/', function (req, res) {
    Shipment.find()
        .then(shipmentData => {
            if (shipmentData) {
                res.json({ result: true, allShipment: shipmentData });
            } else {
                res.json({ result: false, error: 'Shipment not found' });
            }
        });
});

// GET Shipment by Operator//
router.get('/shipmentByOperator/:shipment_Operator', function (req, res) {
    Shipment.find()
        .then(shipmentData => {
            if (shipmentData) {
                res.json({ result: true, allShipments: shipmentData });
            } else {
                res.json({ result: false, error: 'Shipment not found' });
            }
        });
});

//POST shipment by Operator for initialization //
router.post('/', function (req, res) {
   
    const newShipment = new Shipment({
        shipment_operator: req.body.shipment_operator,
        continent: req.body.continent,
        country: req.body.country,
        shipment_price_LP: req.body.shipment_price_LP,
        shipment_price_otherFormats: req.body.shipment_price_otherFormats,
    });
    newShipment.save().then((shipmentData) => {
        res.json({ result: true, shipmentData: shipmentData });
    });
});



module.exports = router; 