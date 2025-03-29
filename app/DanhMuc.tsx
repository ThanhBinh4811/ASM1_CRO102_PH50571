import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const API_URL = "http://192.168.33.103:3000/products"; // 🔥 API của bạn

const DanhMuc = () => {
  const route = useRoute();
  const { category } = route.params; // Nhận dữ liệu category từ màn trước
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tất cả");

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  const fetchFilteredProducts = async (type = "Tất cả") => { // Thêm tham số type
    try {
      setLoading(true);
      let url = `${API_URL}/category/${encodeURIComponent(category)}`;
  
      if (type === "Hàng mới về") {
        url += "?sortBy=createdAt&order=desc";
      } else if (type === "Ưa sáng") {
        url += "?type=Ưa sáng";
      } else if (type === "Ưa bóng") {
        url += "?type=Ưa bóng";
      }
      
      const response = await fetch(url);
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setFilteredProducts(data);
      } else {
        console.error("Phản hồi không phải là mảng:", data);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    fetchFilteredProducts(type);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text>{item.type}</Text>
      <Text style={styles.productPrice}>{item.price}đ</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {category === "Cây trồng" && ( // 🔥 Chỉ hiện thanh lọc khi category là "Cây trồng"
        <View style={styles.filterContainer}>
          {["Tất cả", "Hàng mới về", "Ưa sáng", "Ưa bóng"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterButton, filter === type && styles.activeFilter]}
              onPress={() => handleFilterChange(type)}
            >
              <Text style={filter === type ? styles.activeText : styles.filterText}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: "green",
  },
  filterText: {
    color: "black",
  },
  activeText: {
    color: "white",
  },
});

export default DanhMuc;
