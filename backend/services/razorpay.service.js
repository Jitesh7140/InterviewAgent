const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY_ID;

if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
  throw new Error("Missing Razorpay keys in environment variables");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});

module.exports = razorpay;
