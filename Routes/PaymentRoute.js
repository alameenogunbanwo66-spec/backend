const express = require("express");
const {
  initializePayment,
  initializeCardPayment,
  verifyPayment,
  paystackWebhook,
} = require("../Controllers/PaymentController");

const router = express.Router();

router.post("/initialize", initializePayment);
router.post("/card-init", initializeCardPayment)
router.post("/verify", verifyPayment);
router.post("/webhook" , express.json({type : "*/*"}), paystackWebhook)

module.exports = router;
