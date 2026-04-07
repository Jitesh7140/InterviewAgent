const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controller/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;