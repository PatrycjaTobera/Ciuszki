import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/Login';
import DrawerNav from './DrawerNav';
import Registration from '../screens/Registration/Registration';
import Ad from '../screens/Ad/Ad';
import EditAd from '../screens/EditAd/EditAd';
import Chat from '../screens/Chat/Chat';
import Conversation from '../screens/Conversation/Conversation';
import Basket from '../screens/Basket/Basket';
import Payment from '../screens/Payment/Payment';

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
      <Stack.Screen name="Chat" component={Chat} options={header} />
      <Stack.Screen name="Conversation" component={Conversation} options={header} />
      <Stack.Screen name="Basket" component={Basket} options={header} />
      <Stack.Screen name="Payment" component={Payment} options={header} />
    </Stack.Navigator>
  );
}

export default StackNav;