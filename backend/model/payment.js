const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    planId: {
        type: String
    },
    credits: {
        type: Number 
    },
    razorpayOrderId: {
        type: String 
    },
    razorpayPaymentId: {
        type: String 
    }, 
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    } 
},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema);