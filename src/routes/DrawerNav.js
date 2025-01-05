import React from 'react'; 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';
import TabNav from './TabNav';

import Wallet from '../screens/Wallet/Wallet';
import Settings from '../screens/Settings/Settings';
import OrderHistory from '../screens/OrderHistory/OrderHistory';
import YourAds from '../screens/YourAds/YourAds';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;

  const handleLogOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userLogin');
      await SecureStore.deleteItemAsync('userPassword');
    } finally {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <View style={{ borderTopWidth: 1, borderColor: '#ccc' }}>
        <DrawerItem label="Wyloguj się" onPress={handleLogOut} />
      </View>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#fc20a4', 
        drawerInactiveTintColor: 'gray',  
        headerStyle: {
          backgroundColor: '#fc20a4', 
        },
        headerTintColor: '#fff',  
      }}
    >
      <Drawer.Screen
        name="Tab"
        component={TabNav}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{ title: 'Portfel' }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{ title: 'Ustawienia' }}
      />
      <Drawer.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{ title: 'Historia zamówień' }}
      />
      <Drawer.Screen
        name="YourAds"
        component={YourAds}
        options={{ title: 'Twoje ogłoszenia' }}
      />
    </Drawer.Navigator>
  );
}

export default MyDrawer;