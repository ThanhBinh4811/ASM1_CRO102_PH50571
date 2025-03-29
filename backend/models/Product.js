const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: String,
    type: String,
    price: String,
    image: String, // Lưu URL ảnh
    description: String,
    category : String, // Mô tả sản phẩm
    size : String,
    Location : String,
    stock : Number,
    createdAt: { type: Date, default: Date.now } // Thời gian thêm
  });
  
  const Product = mongoose.model("Product", ProductSchema);
  module.exports = Product