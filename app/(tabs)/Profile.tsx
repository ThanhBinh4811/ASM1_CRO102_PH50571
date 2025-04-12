import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedId = await AsyncStorage.getItem("userId");
        if (!storedId) {
          Alert.alert("Lỗi", "Không tìm thấy userId. Vui lòng đăng nhập lại.");
          router.replace("/(auth)/LoginScreen"); // Điều chỉnh đường dẫn đăng nhập
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      router.replace("/(auth)/LoginScreen"); // Điều hướng về màn hình đăng nhập
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Đăng xuất không thành công');
    }
  };

  // Hàm điều hướng đã được điều chỉnh để hoạt động từ (tabs)
  const navigateTo = (screen) => {
    switch (screen) {
      case 'EditProfile':
        router.push("/(auth)/EditProfile"); // Nếu EditProfile nằm trong (auth)
        break;
      case 'PlantingGuide':
        router.push("/CamNang"); // Nếu trong tabs
        break;
      case 'TransactionHistory':
        router.push("/History");
        break;
      case 'QA':
        router.push("/(tabs)/QA");
        break;
      case 'PrivacyPolicy':
        router.push("/(tabs)/PrivacyPolicy");
        break;
      case 'TermsAndConditions':
        router.push("/(tabs)/TermsAndConditions");
        break;
      default:
        break;
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../(tabs)/Image/Product1.png')}
          style={styles.avatar}
        />
        <Text style={styles.profileName}>{userName || 'Trần Minh Trí'}</Text>
        <Text style={styles.profileEmail}>{userEmail || 'tranminhtri@gmail.com'}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Chung</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigateTo('EditProfile')}
        >
          <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('PlantingGuide')}
        >
          <Text style={styles.menuText}>Cẩm nang trồng cây</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('TransactionHistory')}
        >
          <Text style={styles.menuText}>Lịch sử giao dịch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('QA')}
        >
          <Text style={styles.menuText}>Q & A</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('PrivacyPolicy')}
        >
          <Text style={styles.menuText}>Bảo mật và Điều khoản</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer Menu */}
      <View style={styles.footerSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('TermsAndConditions')}
        >
          <Text style={styles.menuText}>Điều khoản và điều kiện</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('PrivacyPolicy')}
        >
          <Text style={styles.menuText}>Chính sách quyền riêng tư</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, styles.logoutText]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  profileHeader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#e1e1e1',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  menuSection: {
    marginVertical: 16,
  },
  footerSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: 'red',
    textAlign: 'center',
  },
});