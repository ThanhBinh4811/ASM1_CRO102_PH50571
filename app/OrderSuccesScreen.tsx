import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const OrderSuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse dữ liệu từ params
  const items = params.items ? JSON.parse(params.items as string) : [];
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Nội dung chính */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Thông báo thành công */}
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.successTitle}>Đặt hàng thành công</Text>
          <Text style={styles.successSubtitle}>Bạn đã đặt hàng thành công</Text>
        </View>

        {/* Thông tin khách hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Text style={styles.infoText}>{params.userName}</Text>
          <Text style={styles.infoText}>{params.userEmail}</Text>
          <Text style={styles.infoText}>{params.address}</Text>
          <Text style={styles.infoText}>{params.phoneNumber}</Text>
        </View>

        {/* Phương thức vận chuyển */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          <Text style={styles.infoText}>
            {params.shippingMethod} - {params.shippingFee}
            {"\n"}(Dự kiến giao hàng 5-7/9)
          </Text>
        </View>

        {/* Hình thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <Text style={styles.infoText}>{params.paymentMethod}</Text>
        </View>

        {/* Chi tiết đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
          {items.map((item: any) => (
            <View key={item.productId} style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>{item.quantity} x {item.price.toLocaleString()}đ</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tổng thanh toán */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentText}>Đã thanh toán</Text>
          <Text style={styles.paymentAmount}>{params.totalAmount}</Text>
        </View>

        {/* Hướng dẫn */}
        <TouchableOpacity style={styles.guideLink}>
          <Text style={styles.guideText}>Xem Cẩm nang trồng cây</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nút quay về trang chủ */}
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => router.replace("/(tabs)/Home")}
      >
        <Text style={styles.homeButtonText}>Quay về Trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 22,
  },
  item: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  paymentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
  },
  guideLink: {
    marginTop: 10,
    paddingVertical: 10,
  },
  guideText: {
    color: "#1E88E5",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderSuccessScreen;