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
router.get('/shipmentByOperator/:shipment_operator', (req, res)=> {
    Shipment.find({shipment_operator: req.params.shipment_operator})
        .then(shipmentData => {
            if (shipmentData) {
                res.json({ result: true, allShipments: shipmentData });
            } else {
                res.json({ result: false, error: 'Shipment not found' });
            }
        });
});

//POST shipment by Operator for initialization //
router.post('/', async (req, res) => {
    try {
        const shipmentData = req.body;
        const newShipment = new Shipment(shipmentData);
        const savedShipment = await newShipment.save();

        res.status(200).json(savedShipment);
    } catch (error) {
        res.status(400).json({ result: false, message: "fail to requete", details: error.message });
    }
});

module.exports = router; 