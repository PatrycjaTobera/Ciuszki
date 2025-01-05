import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/Login';
import DrawerNav from './DrawerNav';
const Stack = createNativeStackNavigator();

const header = {
  headerShown: false,
};

function StackNav() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={header} />
      <Stack.Screen name="Main" component={DrawerNav} options={header} />
    </Stack.Navigator>
  );
}

export default StackNav;
