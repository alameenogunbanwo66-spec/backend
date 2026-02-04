const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
     customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      state : String,
      city : String,
    },
     items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
     deliveryMethod: {
      type: String,
      enum: ["doorstep", "pickup"],
      required: true,
    },
     paymentMethod: {
      type: String,
      enum: ["delivery", "card", "paypal"],
      required: true,
    },
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
)

const ORDER = mongoose.model("Order", orderSchema)
module.exports = ORDER