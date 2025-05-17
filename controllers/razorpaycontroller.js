const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_FkhYGi7Wa4Thcy', // Replace with your Razorpay key_id
    key_secret: '249mNTT3iambLbJQ6jFRe38D' // Replace with your Razorpay key_secret
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