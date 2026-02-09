const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const PAYMENT = require("../Models/Payment");
const ORDER = require("../Models/Order");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

router.post("/paystack", async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // Find the payment by reference
      const payment = await PAYMENT.findOne({ reference });
      if (!payment) return res.status(404).send("Payment not found");

      // Update payment and associated order
      payment.status = "success";
      await payment.save();

      const order = await ORDER.findById(payment.orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        await order.save();
      }

      console.log(`Order ${order?._id} marked as paid via Paystack webhook`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
