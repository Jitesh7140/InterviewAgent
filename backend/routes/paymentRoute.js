const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controller/paymentController");
const isAuth = require("../middlewares/isAuth");

router.post("/create-order", isAuth, createOrder); 
router.post("/verify-payment", isAuth, verifyPayment);  

module.exports = router;