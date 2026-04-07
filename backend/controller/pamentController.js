const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, planId, credits } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options); 

        await Payment.create({
            userId:req.userId,
            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,
            planId,
            credits,
        });


        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
  
        if (generatedSignature === razorpay_signature) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            await payment.save();
            res.json({ success: true });


        } else {
            res.json({ success: false });
        }


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};