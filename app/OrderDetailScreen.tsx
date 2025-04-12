import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const OrderDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.33.104:3000/Order/${params.orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.orderId]);

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        
      </View>

      {/* Nội dung chính */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Trạng thái đơn hàng */}
        <View style={styles.statusContainer}>
          <Ionicons 
            name={order.status === "cancelled" ? "close-circle" : "checkmark-circle"} 
            size={60} 
            color={order.status === "cancelled" ? "#E53935" : "#4CAF50"} 
          />
          <Text style={styles.statusTitle}>
            {order.status === "cancelled" ? "Đã hủy đơn hàng" : "Đặt hàng thành công"}
          </Text>
          <Text style={styles.orderDate}>
  Ngày đặt: {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : "Đang cập nhật"}
</Text>
        </View>

        {/* Thông tin khách hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Text style={styles.infoText}>{order.userId.name || 'Khách hàng'}</Text>
          <Text style={styles.infoText}>{order.userId.email || ''}</Text>
          <Text style={styles.infoText}>{order.address}</Text>
          <Text style={styles.infoText}>{order.phoneNumber}</Text>
        </View>

        {/* Phương thức vận chuyển */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          <Text style={styles.infoText}>
            {order.shippingMethod} - {order.shippingFee.toLocaleString()}đ
            {"\n"}(Dự kiến giao hàng 5-7/9)
          </Text>
        </View>

        {/* Hình thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <Text style={styles.infoText}>{order.paymentMethod}</Text>
        </View>

        {/* Chi tiết đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
          {order.items.map((item: any) => (
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
          <Text style={styles.paymentText}>Tổng thanh toán</Text>
          <Text style={styles.paymentAmount}>{order.totalAmount.toLocaleString()}đ</Text>
        </View>

        {/* Hướng dẫn */}
        <TouchableOpacity style={styles.guideLink}>
          <Text style={styles.guideText}>Xem Cẩm nang trồng cây</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Nút quay về */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles giống như OrderSuccessScreen, có thể tách ra thành file riêng để tái sử dụng
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  orderDate: {
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
  backButton: {
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
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderDetailScreen;