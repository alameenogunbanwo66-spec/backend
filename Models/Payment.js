const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    paymentMethod: { 
        type: String,
        required: true,
        enum : ["delivery", "creditcard", "paypal", "paystack"] },

    amount: Number,

    reference: String, 
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const PAYMENT = mongoose.model("Payment", paymentSchema)
module.exports = PAYMENT