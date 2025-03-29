import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.33.103:3000/products";

const ManHinhChiTiet = () => {
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addToCart = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId"); // Lấy userId từ AsyncStorage

      if (!userId) {
        alert("Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng!");
        return;
      }

      const cartItem = {
        userId,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
        }]
      };

      const response = await fetch("http://192.168.33.103:3000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert("Đã thêm sản phẩm vào giỏ hàng!");
        router.push("/CartScreen");
      } else {
        alert("Lỗi khi thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };
  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID sản phẩm!");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Không tìm thấy sản phẩm!");

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="green" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!product) return <Text style={styles.errorText}>Sản phẩm không tồn tại!</Text>;
  const rawPrice = product?.price || "0";

  // Xóa khoảng trắng, dấu chấm (.) và dấu phẩy (,) nếu có
  const cleanPrice = rawPrice.toString().trim().replace(/\./g, '').replace(/,/g, '');
  
  // Chuyển đổi sang số
  const priceNumber = parseInt(cleanPrice, 10) || 0;
  
  // Tính tổng giá
  const totalPrice = quantity * priceNumber;


  return (
    <View style={styles.container}>
      <Text style={styles.header}>{product.name}</Text>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.temporaryTotal}>Tạm tính: {totalPrice.toLocaleString()}đ</Text>

      <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Kích cỡ:</Text><Text style={styles.detailValue}>{product.size}</Text></View>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Xuất xứ:</Text><Text style={styles.detailValue}>{product.Location}</Text></View>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Tình trạng:</Text><Text style={styles.detailValue}>Còn {product.Stock} sp</Text></View>

      <View style={styles.quantitySection}>
        <Text style={styles.quantityLabel}>Đã chọn {quantity} sản phẩm</Text>
        <Text style={styles.temporaryTotal}>Tạm tính: {totalPrice.toLocaleString("vi-VN")} VNĐ</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{quantity}</Text>
          <TouchableOpacity
  onPress={() => setQuantity(quantity + 1)}
  style={styles.quantityButton}>
  <Text style={styles.quantityText}>+</Text>
</TouchableOpacity>

        </View>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={addToCart}>
        <Text style={styles.buyText}>CHỌN MUA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  image: { width: "100%", height: 250, resizeMode: "contain", borderRadius: 10, marginVertical: 10 },
  category: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  detailRow: { flexDirection: "row", marginVertical: 5 },
  detailLabel: { fontSize: 16, width: 100, color: "#666" },
  detailValue: { fontSize: 16, fontWeight: "500" },
  quantitySection: { marginTop: 20, backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10 },
  quantityLabel: { fontSize: 16, marginBottom: 5 },
  temporaryTotal: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  quantityButton: { backgroundColor: "#ddd", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  quantityText: { fontSize: 20, fontWeight: "bold" },
  quantityNumber: { fontSize: 20, fontWeight: "bold", marginHorizontal: 20 },
  buyButton: { backgroundColor: "green", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buyText: { color: "white", fontSize: 18, fontWeight: "bold" },
  errorText: { textAlign: "center", color: "red", fontSize: 16, marginTop: 20 },
});

export default ManHinhChiTiet;