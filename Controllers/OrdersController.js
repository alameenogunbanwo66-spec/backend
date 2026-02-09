const mongoose = require("mongoose");
const ORDER = require("../Models/Order");
const USER = require("../Models/User");

const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!deliveryMethod || !["doorstep", "pickup"].includes(deliveryMethod)) {
      return res.status(400).json({ message: "Invalid delivery method" });
    }
    if (!paymentMethod || !["delivery", "creditcard", "paypal", "paystack"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const fullUser = await USER.findById(req.user._id);
    if (!fullUser) return res.status(404).json({ message: "User not found" });
    const year = new Date().getFullYear();
    const orderCount = await ORDER.countDocuments();
    const orderNumber = `ORD-${year}-${String(orderCount + 1).padStart(3, "0")}`;
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);


    const order = await ORDER.create({
      orderNumber,  
      user: req.user._id,
      customer: {
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        email: fullUser.email,
        phone: fullUser.phoneNumber
      },
      items,
      deliveryMethod,
      paymentMethod,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      deliveryDate: estimatedDelivery,

    });
    console.log(order);
    

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await ORDER.find().sort({ createdAt: -1 });
    res.json({orders});
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


const getSingleOrder = async (req, res) => {
  try {
    const order = await ORDER.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role === "user" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({order});
  } catch (error) {
    console.error("Fetch single order error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });

    console.log("Fetching orders for user:", req.user._id); // debug

    const orders = await ORDER.find({ user: req.user._id }).sort({ createdAt: -1 });

    console.log("Orders found:", orders.length); // debug

    res.json({ orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await ORDER.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;

    if (!["pending", "paid", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await ORDER.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentMethod },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await ORDER.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role === "user" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!["pending", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

const searchOrders = async (req, res) => {
  try {
    const { q, status, paymentStatus } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { "customer.firstName": { $regex: q, $options: "i" } },
        { "customer.lastName": { $regex: q, $options: "i" } },
        { "customer.email": { $regex: q, $options: "i" } },
      ];
    }
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await ORDER.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Search orders error:", err);
    res.status(500).json({ message: "Failed to search orders" });
  }
};



module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  searchOrders
};
