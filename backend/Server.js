const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product")
const Cart = require("./models/Cart")
const Order = require("./models/Order")
const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
connectDB();


app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Kiểm tra xem có tài khoản nào chưa
    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "user"; // Tài khoản đầu tiên là admin

    // Kiểm tra email hoặc số điện thoại đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại!" });

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword, role });

    await newUser.save();
    res.json({ message: "Đăng ký thành công!", role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });

    res.json({ message: "Đăng nhập thành công!", user });
  
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});



app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Không trả về mật khẩu
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server!" });
  }
});

// API thêm sản phẩm mới
app.post("/AddProduct", async (req, res) => {
  try {
    const { name, type, price, image, description, category, size, Location, Stock } = req.body;
    const newProduct = new Product({ name, type, price, image, description, category, size, Location, Stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm!" });
  }
});


app.get("/products/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });

    // Tìm kiếm theo tên sản phẩm
    const products = await Product.find({ name: { $regex: keyword, $options: "i" } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm" });
  }
});

// API: Lấy chi tiết sản phẩm
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Route lấy sản phẩm theo category
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sortBy, order, type } = req.query;
    let filter = { category };

    if (type) {
      filter.type = type; // Lọc theo type (Ưa sáng hoặc Ưa bóng)
    }

    let query = Product.find(filter);

    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sortBy]: sortOrder }); // Sắp xếp nếu có yêu cầu
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tải sản phẩm' });
  }
});


app.post("/cart/add", async (req, res) => {
  const { userId, items } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    // Xử lý định dạng `price` của từng item trước khi lưu vào cơ sở dữ liệu
    items.forEach(item => {
      if (typeof item.price === 'string') {
        item.price = Number(item.price.replace(/[^0-9]/g, '')); // Chuyển '200.000đ' -> 200000
      }

      if (isNaN(item.price)) {
        return res.status(400).json({ message: "Giá sản phẩm không hợp lệ!" });
      }
    });

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa tồn tại
      cart = new Cart({
        userId,
        items,
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0)
      });
    } else {
      // Cập nhật giỏ hàng nếu đã tồn tại
      items.forEach((newItem) => {
        const existingItem = cart.items.find(item => item.productId === newItem.productId);
        
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
      
      // Tính lại tổng tiền
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    await cart.save();
    res.status(200).json({ message: "Đã thêm sản phẩm vào giỏ hàng!", cart });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId });

  if (!cart) {
      return res.json({ userId, items: [], totalPrice: 0 });
  }

  res.json(cart);
});


app.delete('/cart/delete', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    userCart.items = userCart.items.filter(item => item.productId !== productId);
    await userCart.save();

    res.status(200).json({ message: "Xoá sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

app.put('/cart/update-quantity', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const userCart = await Cart.findOne({ userId });

    if (!userCart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    const item = userCart.items.find(item => item.productId === productId);

    if (item) {
      item.quantity = quantity;
      userCart.items = userCart.items.filter(item => item.quantity > 0); // Xóa sản phẩm nếu số lượng về 0
      await userCart.save();
      res.status(200).json({ message: "Cập nhật số lượng thành công", items: userCart.items });
    } else {
      res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

app.get("/UserInfor/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});



app.post("/Order/create", async (req, res) => {
  console.log("🔍 Nhận dữ liệu tạo đơn hàng:", req.body);
  
  const {
    userId,
    phoneNumber,
    address,
    shippingMethod,
    shippingFee,
    paymentMethod,
    subtotal,
    selectedItems, // Đổi tên từ items sang selectedItems để khớp với client
    totalAmount
  } = req.body;

  // Validate dữ liệu nghiêm ngặt hơn
  if (!userId || !phoneNumber || !address || !selectedItems || !Array.isArray(selectedItems)) {
    return res.status(400).json({ 
      message: "Thiếu thông tin bắt buộc hoặc định dạng không đúng" 
    });
  }

  // Kiểm tra từng sản phẩm trong selectedItems
  for (const item of selectedItems) {
    if (!item.productId || !item.price || !item.quantity) {
      return res.status(400).json({
        message: `Sản phẩm thiếu thông tin bắt buộc: productId, price hoặc quantity`
      });
    }
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      phoneNumber,
      address,
      shippingMethod,
      shippingFee,
      paymentMethod,
      items: selectedItems.map(item => ({
        productId: item.productId,
        name: item.name || 'Không có tên',
        image: item.image || '',
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      totalAmount,
      status: "pending",
      createdAt: new Date()
    });

    await newOrder.save();

    // Xóa sản phẩm đã đặt khỏi giỏ hàng
    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId: { $in: selectedItems.map(i => i.productId) } } } }
    );

    res.status(201).json({ 
      message: "Đặt hàng thành công", 
      order: newOrder 
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ 
      message: "Lỗi server khi đặt hàng",
      error: error.message 
    });
  }
});



// Lấy tất cả đơn hàng của user
app.get("/Order/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .populate("userId", "name email"); // Lấy thông tin cơ bản của user
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử đơn hàng" });
  }
});

// Lấy chi tiết đơn hàng
app.get("/Order/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId", "name email"); // Lấy thông tin user
    
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng" });
  }
});
// Chạy server
app.listen(3000, () => console.log("🚀 Server đang chạy tại http://localhost:3000"));

