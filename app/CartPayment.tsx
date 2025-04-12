import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý thanh toán (giữ nguyên phần này)
  const handlePayment = async () => {
    if (!validateCardInfo()) return;
    
    try {
      setLoading(true);
      
      // 1. Lấy userId từ AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại");
        return router.replace("/LoginScreen");
      }

      // 2. Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId,
        phoneNumber: params.phoneNumber,
        address: params.address,
        shippingMethod: params.shippingMethod,
        shippingFee: Number(params.shippingFee),
        paymentMethod: "VISA/MASTERCARD",
        paymentDetails: {
          cardLast4: cardNumber.slice(-4),
          cardType: cardNumber.startsWith("4") ? "VISA" : "MASTERCARD"
        },
        subtotal: Number(params.subtotal),
        selectedItems: JSON.parse(params.selectedItems as string),
        totalAmount: Number(params.total)
      };

      // 3. Gọi API tạo đơn hàng
      const response = await axios.post(
        "http://192.168.33.104:3000/Order/create", 
        orderData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // 4. Xử lý sau khi thanh toán thành công
      if (response.data?.order?._id) {
        router.push({
          pathname: "/OrderSuccesScreen",
          params: {
            orderId: response.data.order._id,
            userName: params.userName,
            userEmail: params.userEmail,
            address: params.address,
            phoneNumber: params.phoneNumber,
            shippingMethod: params.shippingMethod,
            shippingFee: params.shippingFee,
            paymentMethod: "VISA/MASTERCARD",
            totalAmount: params.total,
            items: params.selectedItems,
            orderDate: new Date().toLocaleString()
          }
        });
      }
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);
      Alert.alert(
        "Lỗi", 
        error.response?.data?.message || 
        error.message || 
        "Thanh toán không thành công. Vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  // Validate thông tin thẻ (giữ nguyên phần này)
  const validateCardInfo = () => {
    // Kiểm tra các trường bắt buộc
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ");
      return false;
    }

    // Validate số thẻ (16 chữ số, bỏ khoảng trắng)
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      Alert.alert("Lỗi", "Số thẻ không hợp lệ (phải có 16 chữ số)");
      return false;
    }

    // Validate CVV (3-4 chữ số)
    if (!/^\d{3,4}$/.test(cvv)) {
      Alert.alert("Lỗi", "CVV không hợp lệ (phải có 3-4 chữ số)");
      return false;
    }

    // Validate ngày hết hạn (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      Alert.alert("Lỗi", "Ngày hết hạn không hợp lệ (định dạng MM/YY)");
      return false;
    }

    return true;
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>THANH TOÁN</Text>
      </View>

      {/* Form nhập thông tin thẻ */}
      <View style={styles.cardForm}>
        <Text style={styles.sectionTitle}>Nhập thông tin thẻ</Text>
        
        <Text style={styles.inputLabel}>Số thẻ</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(text) => 
            setCardNumber(text.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim())
          }
          placeholder="XXXX XXXX XXXX XXXX"
          keyboardType="numeric"
          maxLength={19}
        />
        
        <Text style={styles.inputLabel}>Tên chủ thẻ</Text>
        <TextInput
          style={styles.input}
          value={cardName}
          onChangeText={setCardName}
          placeholder="NGUYEN VAN A"
          autoCapitalize="characters"
        />
        
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Ngày hết hạn (MM/YY)</Text>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={(text) => {
                const formatted = text.replace(/\D/g, "")
                  .replace(/^(\d{2})/, "$1/")
                  .substring(0, 5);
                setExpiryDate(formatted);
              }}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, "").substring(0, 4))}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
      </View>

      {/* Thông tin khách hàng */}
      <View style={styles.customerInfo}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoText}>{params.userName || 'Trần Minh Trí'}</Text>
        <Text style={styles.infoText}>{params.userEmail || 'tranminhtri@gmail.com'}</Text>
        <Text style={styles.infoText}>{params.address || '60 Láng Hạ, Ba Đình, Hà Nội'}</Text>
        <Text style={styles.infoText}>{params.phoneNumber || '0123456789'}</Text>
      </View>

      {/* Tổng thanh toán */}
      <View style={styles.paymentSummary}>
        <Text style={styles.totalText}>Tổng thanh toán: {Number(params.total).toLocaleString()}đ</Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity 
        style={[styles.payButton, loading && styles.disabledButton]} 
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.payButtonText}>THANH TOÁN</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardForm: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerInfo: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentSummary: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    color: '#007bff',
    fontSize: 14,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});