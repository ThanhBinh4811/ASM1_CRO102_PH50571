import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ManHinhChiTiet" options={{ headerShown: false }} />
      <Stack.Screen name="DanhMuc" options={{ headerShown: false }} />
      <Stack.Screen name='DanhMuc2' options={{headerShown: false}}/>
      <Stack.Screen name='CartScreen' options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}