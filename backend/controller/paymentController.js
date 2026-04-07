import dotenv from 'dotenv';
import Payment from "../model/payment.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../model/user.model.js";


dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY_ID,
});


export const createOrder = async (req, res) => {
  try {
    const { amount, planId, credits } = req.body;

    // FIX: Convert "650 Credits" (string) to 650 (number)
    // parseInt will take "650" and ignore " Credits"
    const numericCredits = parseInt(credits); 

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId,
      credits: numericCredits, // Use the cleaned number here
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

   

    // The string must be: order_id + "|" + payment_id
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY_ID) // Use the SECRET here
      .update(body.toString())
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id,
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.status === "paid") {
        return res.status(400).json({ error: "Payment already completed" });
      }

      payment.status = "paid";
      payment.razorpayPaymentId = razorpay_payment_id;

      await payment.save();

      // add credites to user
      const updateUser = await User.findByIdAndUpdate(
        req.userId,
        {
          $inc: { credits: payment.credits },
        },
        { new: true },
      );

      res.json({
        success: true,
        message: "Payment verified successfully",
        user: updateUser,
      });
    } else {
      
       res.json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
