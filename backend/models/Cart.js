const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true } // ✅ Thêm timestamps để MongoDB tự động lưu createdAt & updatedAt
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
