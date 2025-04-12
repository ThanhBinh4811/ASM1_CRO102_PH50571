// app/(tabs)/PlantingGuide.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function PlantingGuide() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/CamNangScreen'); // Điều hướng tới màn chi tiết
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CẨM NANG TRỒNG CÂY</Text>

      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image 
          source={{uri :"https://noithatduyphat.vn/wp-content/uploads/2019/02/tuoi-nao-dat-cay-xuong-rong-tren-ban-lam-viec-la-tot-nhat-1.jpg"}}
          style={styles.image}
        />
        <View>
          <Text style={styles.name}>Panse Đen | Hybrid</Text>
          <Text style={styles.level}>Độ khó 3/5</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  level: { fontSize: 14, color: '#555' },
});
