import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import styles from './styles'; 

function LoginScreen({ navigation }) {
  const [loginData, setLoginData] = useState({
    login: '',
    password: '',
  });

  useEffect(() => {
    const loadLoginData = async () => {
      const savedLogin = await SecureStore.getItemAsync('userLogin');
      const savedPassword = await SecureStore.getItemAsync('userPassword');
      if (savedLogin && savedPassword) {
        setLoginData({ login: savedLogin, password: savedPassword });
      }
    };

    loadLoginData();
  }, []);

  const login = async () => {
    if (loginData.login && loginData.password) {
      if (loginData.password === loginData.login) {
        await SecureStore.setItemAsync('userLogin', loginData.login);
        await SecureStore.setItemAsync('userPassword', loginData.password);
        navigation.navigate('Main'); 
      } else {
        Alert.alert('Błąd', 'Hasło nie zgadza się z loginem');
      }
    } else {
      Alert.alert('Błąd', 'Wpisz oba: login i hasło');
    }
  };

  const goToRegistration = () => {
    navigation.navigate('Registration'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Ciuszki</Text>

      <Text style={styles.header}>Logowanie</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={loginData.login}
        onChangeText={(text) => setLoginData({ ...loginData, login: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        value={loginData.password}
        onChangeText={(text) => setLoginData({ ...loginData, password: text })}
      />
      
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={goToRegistration}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;
