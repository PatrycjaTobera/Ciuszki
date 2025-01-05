import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home/Home'; 
import Search from '../screens/Search/Search'; 
import NewAd from '../screens/NewAd/NewAd';
import Chat from '../screens/Chat/Chat';
import Profile from '../screens/Profile/Profile'; 

const Tab = createBottomTabNavigator();

function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff', 
        },
        tabBarLabelStyle: {
          fontSize: 10, 
          fontWeight: 'bold', 
        },
        tabBarActiveTintColor: '#fc20a4', 
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Nowości" 
        component={Home} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Szukaj" 
        component={Search} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Sprzedaj" 
        component={NewAd} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Wiadomości" 
        component={Chat} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profil" 
        component={Profile} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default TabNav;
