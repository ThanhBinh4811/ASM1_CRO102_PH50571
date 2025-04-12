import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const API_URL = "http://192.168.33.104:3000/products"; // 🔥 API của bạn

const DanhMuc2 = () => {
  const route = useRoute();
  const { category } = route.params; // Nhận dữ liệu category từ màn trước
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  const fetchFilteredProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/category/${category}`); // Thêm endpoint lọc theo category
      const data = await response.json();
      setFilteredProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}đ</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm thuộc danh mục: {category}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  productImage: { width: 120, height: 120, resizeMode: "contain" },
  productName: { fontWeight: "bold", marginTop: 5, textAlign: "center" },
  productPrice: { color: "green", fontWeight: "bold", marginTop: 5 },
});

export default DanhMuc2;
