const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    method: String,

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

const PAYMENT = mongoose.model("Order", paymentSchema)
module.exports = PAYMENT