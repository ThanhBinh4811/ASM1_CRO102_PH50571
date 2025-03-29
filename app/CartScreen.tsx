import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_URL = "http://192.168.33.103:3000/cart";

const Cart = () => {
    const [cartItems, setCartItems] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                alert("User chưa đăng nhập!");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/${userId}`);
                const data = await response.json();
                if (Array.isArray(data.items)) { 
                    setCartItems(data.items);
                } else {
                    setCartItems([]); // Nếu không phải mảng, khởi tạo thành mảng rỗng
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu giỏ hàng: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleSelectItem = (productId) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    const handleQuantityChange = async (productId, action) => {
        const userId = await AsyncStorage.getItem("userId");
        const currentItem = cartItems.find(item => item.productId === productId);
        const newQuantity = action === 'increase' ? currentItem.quantity + 1 : currentItem.quantity - 1;

        if (newQuantity === 0) {
            return handleDeleteItem(productId); // Xóa sản phẩm nếu số lượng về 0
        }

        try {
            const response = await fetch(`${API_URL}/update-quantity`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: newQuantity })
            });

            const data = await response.json();

            if (response.ok) {
                setCartItems(data.items);
            } else {
                alert(data.message || "Cập nhật số lượng thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng: ", error);
        }
    };


    const handleDeleteItem = async (productId: string) => {
        const userId = await AsyncStorage.getItem("userId");
    
        try {
            const response = await fetch(`${API_URL}/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Cập nhật giỏ hàng bằng cách lọc bỏ sản phẩm vừa bị xóa
                const updatedCartItems = cartItems.filter(item => item.productId !== productId);
                setCartItems(updatedCartItems);
    
                // Cập nhật selectedItems để không còn giữ sản phẩm đã bị xóa
                setSelectedItems(selectedItems.filter(id => id !== productId));
            } else {
                alert(data.message || "Xóa sản phẩm thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm: ", error);
        }
    }

    const getTotalPrice = () => {
        if (!Array.isArray(cartItems)) return "0";
        return cartItems
            .filter(item => selectedItems.includes(item.productId))
            .reduce((total, item) => total + (item.price * item.quantity), 0)
            .toLocaleString();
    };

    if (loading) return <ActivityIndicator size="large" color="green" />;
    if (!Array.isArray(cartItems) || cartItems.length === 0) return <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>;

    return (
        <View style={styles.container}>
           <FlatList
    data={Array.isArray(cartItems) ? cartItems : []}
    keyExtractor={(item) => item.productId}
    extraData={selectedItems}
    renderItem={({ item }) => (
        <View style={styles.item}>
            <Checkbox
                value={selectedItems.includes(item.productId)}
                onValueChange={() => handleSelectItem(item.productId)}
                style={styles.checkbox}
            />
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.productId, 'decrease')}>
                        <Ionicons name="remove-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.productId, 'increase')}>
                        <Ionicons name="add-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleDeleteItem(item.productId)}>
                    <Text style={styles.delete}>Xoá</Text>
                </TouchableOpacity>
            </View>
        </View>
    )}
/>

            {selectedItems.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalText}>Tạm tính: {getTotalPrice()}đ</Text>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    item: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
    image: { width: 60, height: 60, marginRight: 10, borderRadius: 8 },
    checkbox: { marginRight: 10 },
    name: { fontSize: 16, fontWeight: "bold" },
    price: { color: "green", marginTop: 4 },
    quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    quantity: { marginHorizontal: 8, fontSize: 16 },
    delete: { color: "red", marginTop: 4 },
    footer: { padding: 16, borderTopWidth: 1, borderColor: "#ddd" },
    totalText: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    checkoutButton: {
        backgroundColor: "green",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    checkoutText: { color: "#fff", fontWeight: "bold" },
    emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
});

export default Cart;
