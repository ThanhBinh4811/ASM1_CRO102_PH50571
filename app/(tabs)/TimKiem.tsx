import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://192.168.33.104/products/search"; // Thay API của bạn

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim()) {
        searchProducts();
      } else {
        setSearchResults([]); // Xóa kết quả khi input rỗng
      }
    }, 300); // Debounce 300ms tránh spam API

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const loadRecentSearches = async () => {
    try {
      const history = await AsyncStorage.getItem("recentSearches");
      if (history) setRecentSearches(JSON.parse(history));
    } catch (error) {
      console.error("Lỗi khi load lịch sử:", error);
    }
  };

  const searchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}?keyword=${searchText}`);
      const data = await response.json();
      setSearchResults(data);

      saveSearchHistory(searchText);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const saveSearchHistory = async (keyword) => {
    try {
      let history = [keyword, ...recentSearches.filter((item) => item !== keyword)];
      if (history.length > 5) history = history.slice(0, 5);

      await AsyncStorage.setItem("recentSearches", JSON.stringify(history));
      setRecentSearches(history);
    } catch (error) {
      console.error("Lỗi lưu lịch sử:", error);
    }
  };

  const removeSearchItem = async (keyword) => {
    const updatedHistory = recentSearches.filter((item) => item !== keyword);
    setRecentSearches(updatedHistory);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedHistory));
  };

  const handleProductPress = (productId) => {
    navigation.navigate("ManHinhChiTiet", { id: productId }); // Thêm dòng này
  };

  return (
    <View style={styles.container}>
      <Text style = {{textAlign: 'center', marginTop: 20, fontSize: 20}}>Tìm Kiếm</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={24} color="black" />
        )}
      </View>

      
      {recentSearches.length > 0 && !searchText && (
        <View>
          <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
          {recentSearches.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Ionicons name="time-outline" size={20} />
              <Text style={styles.historyText}>{item}</Text>
              <TouchableOpacity onPress={() => removeSearchItem(item)}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductPress(item._id)}>
          <View style={styles.resultItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View>
              <Text style={styles.resultText}>{item.name}</Text>
              <Text style={styles.priceText}>{item.price}đ</Text>
              <Text style={styles.stockText}>Còn {item.stock} sp</Text>
            </View>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, paddingBottom: 8 },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  historyItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  historyText: { flex: 1, marginLeft: 8 },
  resultItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  resultText: { fontSize: 16, fontWeight: "bold" },
  priceText: { fontSize: 14, color: "green" },
  stockText: { fontSize: 12, color: "gray" },
});

export default SearchScreen;
