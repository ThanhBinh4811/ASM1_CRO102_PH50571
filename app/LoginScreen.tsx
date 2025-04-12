import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State để hiển thị lỗi
  const [showPassword, setShowPassword] = useState(false); // State để kiểm soát hiển thị mật khẩu
  const router = useRouter();

  const handleLogin = async () => {
    setError(""); // Reset lỗi trước khi gửi request
    try {
      const response = await fetch("http://192.168.33.104:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Response từ server:", data); // 👈 Thêm dòng log này
  
      if (!response.ok) {
        setError(data.message); // Gán lỗi vào state để hiển thị
        return;
      }
  
      const userId = data.user?._id;  // Kiểm tra xem nó có phải là chuỗi hay không
  
      if (userId) { // Chỉ lưu nếu userId tồn tại
        await AsyncStorage.setItem("userId", String(userId)); // Chuyển userId thành chuỗi
      
        // Log xem userId đã được lưu hay chưa
        const savedUserId = await AsyncStorage.getItem("userId");
        console.log("Đã lưu userId:", savedUserId); // 👈 Kiểm tra xem userId đã được lưu chưa
      } else {
        console.log("Lỗi: Không tìm thấy userId trong response từ server");
      }
  
      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.replace("/(tabs)/Home"); // 🔥 Điều hướng đúng cách
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image style={{ width: 50, height: 390, paddingLeft: 450, paddingBottom: 20 }} source={require("../assets/images/Ellipse 1.png")} />
        <TouchableOpacity style={styles.backButton}>
          <Image source={require("../assets/images/ic_back.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Chào mừng bạn</Text>
        <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

        <TextInput style={styles.input} placeholder="Nhập email hoặc số điện thoại" value={email} onChangeText={setEmail} />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]} // Thêm style đỏ nếu có lỗi
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword} // Ẩn/hiện mật khẩu theo state
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? require("../assets/images/eyeOpen.png") : require("../assets/images/eyeOff.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Hiển thị lỗi bên dưới ô mật khẩu */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.row}>
          <TouchableOpacity style={styles.checkboxContainer}>
            <Image source={require("../assets/images/ic_check.png")} style={styles.icon} />
            <Text style={styles.rememberText}>Nhớ tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient colors={["#11998e", "#38ef7d"]} style={styles.loginButton}>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.orText}>Hoặc</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require("../assets/images/ic_google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require("../assets/images/ic_face.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text>Bạn không có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push("/RegisterScreen")}> 
            <Text style={styles.registerText}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 20 },
  form: { flex: 1, padding: 20 },
  title: { fontSize: 34, fontWeight: "bold", textAlign: "center", color: "#000" },
  subtitle: { textAlign: "center", color: "gray", marginBottom: 20, fontSize: 24 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 15 },
  passwordContainer: { position: "relative" },
  eyeIcon: { position: "absolute", right: 15, top: 10, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  rememberText: { marginLeft: 5 },
  forgotPassword: { color: "green" },
  loginButton: { padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  loginText: { color: "#fff", fontWeight: "bold" },
  orText: { textAlign: "center", color: "gray", marginVertical: 10 },
  socialButtons: { flexDirection: "row", justifyContent: "center", gap: 20 },
  socialButton: { padding: 10, borderRadius: 10, backgroundColor: "#f5f5f5" },
  socialIcon: { width: 30, height: 30 },
  icon: { width: 22, height: 22, tintColor: "gray" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  registerText: { color: "green", fontWeight: "bold" },
  inputError: { borderColor: "red", borderWidth: 1 },
  errorText: { color: "red", marginTop: 5 },
});

export default LoginScreen;
