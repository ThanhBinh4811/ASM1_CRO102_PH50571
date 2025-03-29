import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon } from 'react-native-elements';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#fff', height: 60 },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Icon name="home" type="feather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="TimKiem"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <Icon name="search" type="feather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />,

        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,

        }}
      />


    </Tabs>
  );
}
