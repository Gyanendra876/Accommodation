const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/razorpaycontroller');

router.post('/create-order', razorpayController.createOrder);

module.exports = router;