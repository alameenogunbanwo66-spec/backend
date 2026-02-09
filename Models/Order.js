const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
     user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
      },
      orderNumber: { 
        type: String, 
        required: true, 
        unique : true },
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
      enum: ["delivery", "creditcard", "paypal","paystack"],
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
    deliveryDate : {
      type : Date,
    }
  },
  { timestamps: true }
)

const ORDER = mongoose.model("Order", orderSchema)
module.exports = ORDER