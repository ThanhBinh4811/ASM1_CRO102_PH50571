import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen() {
  const { selectedItems, subtotal } = useLocalSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("Giao hàng Nhanh");
  const [paymentMethod, setPaymentMethod] = useState("VISA/MASTERCARD");
  const [loading, setLoading] = useState(false);

  const shippingFee = shippingMethod === "Giao hàng Nhanh" ? 15000 : 20000; // Cập nhật phí vận chuyển
  const items = JSON.parse(selectedItems as string);
  const total = parseFloat(subtotal as string) + shippingFee;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedId = await AsyncStorage.getItem("userId");
        if (!storedId) {
          Alert.alert("Lỗi", "Không tìm thấy userId. Vui lòng đăng nhập lại.");
          router.replace("/LoginScreen");
          return;
        }
        setUserId(storedId);

        const res = await axios.get(`http://192.168.33.104:3000/UserInfor/${storedId}`);
        setUserName(res.data.name);
        setUserEmail(res.data.email);
      } catch (error) {
        console.log("Lỗi khi lấy thông tin người dùng:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
      }
    };
    fetchUserData();
  }, []);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    
    if (method === "VISA/MASTERCARD") {
      // Chuyển sang màn hình thanh toán thẻ
      router.push({
        pathname: "/CartPayment",
        params: {
          selectedItems: JSON.stringify(items),
          subtotal: subtotal.toString(),
          userName,
          userEmail,
          address,
          phoneNumber,
          shippingMethod,
          shippingFee: shippingFee.toString(),
          total: total.toString()
        }
      });
    }
  };

  const handlePlaceOrder = async () => {
    // Nếu là thanh toán thẻ, đã xử lý ở màn hình khác
    if (paymentMethod === "VISA/MASTERCARD") return;
    
    if (!address || !phoneNumber) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ địa chỉ và số điện thoại");
      return;
    }

    try {
      setLoading(true);
      
      const validItems = items.map(item => ({
        productId: item.productId.toString(),
        name: item.name || 'Không có tên',
        image: item.image || '',
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));

      const orderData = {
        userId: userId?.toString(),
        phoneNumber,
        address,
        shippingMethod,
        shippingFee: Number(shippingFee),
        paymentMethod,
        subtotal: Number(subtotal),
        selectedItems: validItems,
        totalAmount: Number(total)
      };

      const response = await axios.post("http://192.168.33.104:3000/Order/create", orderData);

      if (response.data) {
        router.push({
          pathname: "/OrderSuccesScreen",
          params: {
            orderId: response.data.order._id,
            userName: userName || 'Khách hàng',
            userEmail: userEmail || '',
            address: address,
            phoneNumber: phoneNumber,
            shippingMethod: shippingMethod,
            shippingFee: shippingFee.toLocaleString() + "đ",
            paymentMethod: paymentMethod,
            totalAmount: total.toLocaleString() + "đ",
            items: JSON.stringify(validItems),
            orderDate: new Date().toLocaleString()
          }
        });
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      Alert.alert("Lỗi", error.message || "Đặt hàng không thành công");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Thông tin khách hàng */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Thông tin khách hàng</Text>
          <TouchableOpacity>
            <Text style={{ color: '#007bff' }}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16, marginTop: 5 }}>{userName}</Text>
        <Text style={{ fontSize: 16 }}>{userEmail}</Text>
      </View>

      {/* Thông tin giao hàng */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Thông tin giao hàng</Text>
          <TouchableOpacity>
            <Text style={{ color: '#007bff' }}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ marginTop: 5 }}>Địa chỉ:</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ giao hàng"
          style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
        />

        <Text>Số điện thoại:</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Nhập SĐT"
          keyboardType="phone-pad"
          style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        />
      </View>

      {/* Phương thức vận chuyển */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Phương thức vận chuyển</Text>
        {["Giao hàng Nhanh", "Giao hàng COD"].map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setShippingMethod(method)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: shippingMethod === method ? "blue" : "#ccc",
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text>{method} - {method === "Giao hàng Nhanh" ? "15.000đ" : "20.000đ"}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {method === "Giao hàng Nhanh" ? "(Dự kiến giao hàng 5-7/9)" : "(Dự kiến giao hàng 4-8/9)"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Phương thức thanh toán */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Phương thức thanh toán</Text>
        {["VISA/MASTERCARD", "ATM"].map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => handlePaymentMethodSelect(method)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: paymentMethod === method ? "green" : "#ccc",
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tổng thanh toán */}
      <View style={{ marginVertical: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <Text>Tạm tính</Text>
          <Text>{parseFloat(subtotal as string).toLocaleString()}đ</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <Text>Phí vận chuyển</Text>
          <Text>{shippingFee.toLocaleString()}đ</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, paddingTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Tổng cộng</Text>
          <Text style={{ fontWeight: "bold" }}>{total.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity
        onPress={handlePlaceOrder}
        style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
        }}
        disabled={loading || paymentMethod === "VISA/MASTERCARD"} // Disable nếu là thanh toán thẻ
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}