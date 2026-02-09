const PAYMENT = require("../Models/Payment");
const ORDER = require("../Models/Order");
const paypal = require("@paypal/checkout-server-sdk");
const axios = require('axios');
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// PayPal client
const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
);


const initializePayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;

    if (!orderId || !method) {
      return res.status(400).json({ message: "orderId and method required" });
    }

    const order = await ORDER.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // PAYPAL FLOW
    if (method === "paypal") {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order.totalAmount,
            },
          },
        ],
      });

      const response = await paypalClient.execute(request);

      const payment = await PAYMENT.create({
        orderId: order._id,
        paymentMethod : method,
        amount: order.totalAmount,
        reference: response.result.id,
        status: "pending",
      });

      return res.status(201).json({
        approvalUrl: response.result.links.find(l => l.rel === "approve").href,
        paymentId: payment._id,
      });
    }

    // PAYSTACK FLOW
    if (method === "paystack") {
        const response = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email: order.customer.email,
    amount: order.totalAmount * 100,
    currency: "NGN",
    metadata: { orderId: order._id.toString() },
  },
  {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  }
);

const data = response.data;

      if (!data.status) {
        return res.status(400).json({ message: data.message || "Paystack initialization failed" });
      }

      const payment = await PAYMENT.create({
        orderId: order._id,
        paymentMethod: "paystack",
        amount: order.totalAmount,
        reference: data.data.reference,
        status: "pending",
      });

      return res.status(201).json({
        authorization_url: data.data.authorization_url,
        paymentId: payment._id,
      });
    }

    // PAY ON DELIVERY
    if (method === "delivery") {
     await PAYMENT.create({
    orderId: order._id,
    paymentMethod: "delivery",
    amount: order.totalAmount,
    status: "pending",
     });
      order.paymentStatus = "pending";
      await order.save();

      return res.status(201).json({
        message: "Order placed. Payment pending on delivery",
        orderId: order._id,
      });
    }

    res.status(400).json({ message: "Invalid payment method" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

const initializeCardPayment = async (req, res) => {
  const { email, amount } = req.body;
  try {
    const { data } = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        channels: ["card"],
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!data.status) return res.status(400).json({ message: data.message });

    res.status(201).json({ reference: data.data.reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Card initialization failed" });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { paymentId, paypalOrderId, reference } = req.body;

    const payment = await PAYMENT.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const order = await ORDER.findById(payment.orderId);

    // PAYPAL VERIFY
    if (payment.method === "paypal") {
      const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
      const response = await paypalClient.execute(request);

      if (response.result.status === "COMPLETED") {
        payment.status = "success";
        order.paymentStatus = "paid";

        await payment.save();
        await order.save();

        return res.json({ message: "PayPal payment verified successfully" });
      }

      return res.status(400).json({ message: "PayPal payment verification failed" });
    }

    // PAYSTACK VERIFY
    if (payment.method === "paystack") {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      });
      const data = await response.json();

      if (data.data.status === "success") {
        payment.status = "success";
        order.paymentStatus = "paid";

        await payment.save();
        await order.save();

        return res.json({ message: "Paystack payment verified successfully" });
      }

      return res.status(400).json({ message: "Paystack payment not successful" });
    }

    // CARD VERIFY (optional placeholder)
    if (payment.method === "creditcard") {
      payment.status = "success";
      order.paymentStatus = "paid";

      await payment.save();
      await order.save();

      return res.json({ message: "Card payment verified" });
    }

    res.status(400).json({ message: "Verification failed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const { reference } = event.data;

      const payment = await PAYMENT.findOne({ reference });
      if (payment) {
        payment.status = "success";

        const order = await ORDER.findById(payment.orderId);
        if (order) {
          order.paymentStatus = "paid";
          await order.save();
        }

        await payment.save();
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Paystack webhook error:", err.message);
    res.sendStatus(500);
  }
};


module.exports = {
  initializePayment,
  initializeCardPayment,
  verifyPayment,
  paystackWebhook,
};
