require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Now using env variable
    key_secret: process.env.RAZORPAY_KEY_SECRET // Now using env variable
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: "order_rcptid_" + Math.floor(Math.random() * 10000)
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).send('Error creating order');
    }
};
