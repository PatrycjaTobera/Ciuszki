import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/Login';
import DrawerNav from './DrawerNav';
import Registration from '../screens/Registration/Registration';
import Ad from '../screens/Ad/Ad'
import EditAd from '../screens/EditAd/EditAd'
const Stack = createNativeStackNavigator();

const header = {
  headerShown: false,
};

function StackNav() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={header} />
      <Stack.Screen name="Main" component={DrawerNav} options={header} />
      <Stack.Screen name="Registration" component={Registration} options={header} />
      <Stack.Screen name="Ad" component={Ad} options={header} />
      <Stack.Screen name="EditAd" component={EditAd} options={header} />
    </Stack.Navigator>
  );
}

export default StackNav;
