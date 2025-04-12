const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  shippingMethod: {
    type: String,
    enum: ["Giao hàng Nhanh", "Giao hàng COD"],
    required: true,
  },
  shippingFee: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["VISA/MASTERCARD", "ATM"],
    required: true,
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
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Chờ xác nhận" },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
