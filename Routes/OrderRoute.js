const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  searchOrders,
} = require("../Controllers/OrdersController");
const { auth, isAdmin, isUser } = require("../Middlewares/Auth");

// Admin-only
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.get("/search", auth, isAdmin, searchOrders);

// User routes
router.get("/myOrders", auth, isUser, getUserOrders);
router.post("/", auth, isUser, createOrder);
router.patch("/:id/cancel", auth, isUser, cancelOrder);
router.patch("/:id/status", auth, isAdmin, updateOrderStatus);
router.patch("/:id/payment", auth, isAdmin, updatePaymentStatus);


router.get("/:id", auth, getSingleOrder);

module.exports = router;
