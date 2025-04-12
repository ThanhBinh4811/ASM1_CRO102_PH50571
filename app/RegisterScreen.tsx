import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Lưu lỗi từ server
  const router = useRouter();

  const validateInputs = () => {
    if (!name.trim()) {
      setError("Tên không được để trống!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng!");
      return false;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError(""); // Reset lỗi trước khi gửi request
    if (!validateInputs()) return;

    try {
      const response = await fetch("http://192.168.33.104:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }

      Alert.alert("Thành công", "Đăng ký thành công! Hãy đăng nhập.", [
        { text: "OK", onPress: () => router.replace("/LoginScreen") },
      ]);
    } catch (error) {
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Ảnh nền trên cùng */}
      <View style={styles.header}>
        <Image style={{ width: 250, height: 290, paddingLeft: 520 }} source={require("../assets/images/Ellipse 2.png")} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require("../assets/images/ic_back.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Form đăng ký */}
      <View style={styles.form}>
        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản</Text>

        <TextInput style={styles.input} placeholder="Họ tên" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />

        {/* Hiển thị lỗi nếu có */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.termsText}>
          Để đăng ký tài khoản, bạn đồng ý{" "}
          <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>

        <LinearGradient colors={["#007537", "#4CAF50"]} style={styles.registerButton}>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Đăng ký</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.orText}>Hoặc</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity>
            <Image source={require("../assets/images/ic_google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/images/ic_face.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text>Tôi đã có tài khoản </Text>
          <TouchableOpacity onPress={() => router.replace("/LoginScreen")}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { width: "100%", overflow: "hidden" },
  icon: { width: 24, height: 24, tintColor: "gray" },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10 },
  form: { flex: 1, padding: 20 },
  title: { fontSize: 35, fontWeight: "bold", textAlign: "center", color: "#000" },
  subtitle: { textAlign: "center", color: "gray", marginBottom: 20, paddingTop: 20, fontSize: 20 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 15 },
  termsText: { fontSize: 13, textAlign: "center", marginBottom: 15 },
  linkText: { color: "green", fontWeight: "bold" },
  registerButton: { padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  registerText: { color: "#fff", fontWeight: "bold", fontSize: 19 },
  orText: { textAlign: "center", color: "gray", marginVertical: 10 },
  socialButtons: { flexDirection: "row", justifyContent: "center", gap: 20 },
  socialIcon: { width: 30, height: 30 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  loginText: { color: "green", fontWeight: "bold" },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
});

export default RegisterScreen;
