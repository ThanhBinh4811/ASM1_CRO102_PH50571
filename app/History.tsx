import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedId = await AsyncStorage.getItem("userId");
        if (!storedId) {
          router.replace("/LoginScreen");
          return;
        }
        setUserId(storedId);

        const response = await axios.get(`http://192.168.33.104:3000/Order/user/${storedId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Đang cập nhật ngày";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      };
      
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error("Lỗi khi định dạng ngày:", error);
      return "Ngày không hợp lệ";
    }
  };

  if (loading) {
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
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>LỊCH SỬ GIAO DỊCH</Text>
      </View>

      {/* Danh sách đơn hàng */}
      <ScrollView contentContainerStyle={styles.content}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={styles.orderCard}
              onPress={() => router.push({
                pathname: "/OrderDetailScreen",
                params: {
                  orderId: order._id,
                  status: order.status,
                  totalAmount: order.totalAmount.toString(),
                  items: JSON.stringify(order.items),
                  orderDate: order.orderDate || order.createdAt,
                  address: order.address,
                  phoneNumber: order.phoneNumber,
                  shippingMethod: order.shippingMethod,
                  paymentMethod: order.paymentMethod
                }
              })}
            >
              {/* Nội dung đơn hàng */}
              <View style={styles.orderContentWrapper}>
                <Text style={styles.orderDate}>
                  {formatDate(order.orderDate || order.createdAt)}
                </Text>
                
                <View style={styles.statusContainer}>
                  <Text style={[
                    styles.statusText,
                    order.status === "cancelled" && styles.statusCancelled,
                    order.status === "pending" && styles.statusPending
                  ]}>
                    {order.status === "cancelled" ? "Đã hủy đơn hàng" : 
                     order.status === "pending" ? "Đang xử lý" : "Đặt hàng thành công"}
                  </Text>
                </View>
                
                <View style={styles.productsContainer}>
                  {order.items.slice(0, 2).map((item: any) => (
                    <Text 
                      key={`${order._id}-${item._id}`}
                      style={styles.productText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name} | {item.quantity} sản phẩm
                    </Text>
                  ))}
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>
                    Tổng: {order.totalAmount.toLocaleString('vi-VN')}đ
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  titleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  orderCard: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderContentWrapper: {
    // Thêm style nếu cần
  },
  orderDate: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50", // Màu mặc định (thành công)
  },
  statusCancelled: {
    color: "#F44336", // Màu đỏ cho trạng thái đã hủy
  },
  statusPending: {
    color: "#FF9800", // Màu cam cho trạng thái đang xử lý
  },
  productsContainer: {
    marginBottom: 8,
  },
  productText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default TransactionHistoryScreen;