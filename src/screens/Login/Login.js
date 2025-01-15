import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { useBaseUrl } from '../../contexts/BaseUrlContext'; 
import { useUser } from '../../contexts/UserContext';
import styles from './styles';

function LoginScreen({ navigation }) {
  const [loginData, setLoginData] = useState({
    login: '',
    password: '',
  });
  const { loginUser } = useUser();
  const BASE_URL = useBaseUrl(); 

  useEffect(() => {
    const loadLoginData = async () => {
      try {
        const savedData = await SecureStore.getItemAsync('userData');
        if (savedData) {
          const { login, password } = JSON.parse(savedData);
          setLoginData({ login, password });
        }
      } catch (error) {
        console.error('Błąd przy ładowaniu danych logowania:', error);
      }
    };

    loadLoginData();
  }, []);

  const comparePasswords = async (inputPassword, storedPasswordHash) => {
    try {
      const inputPasswordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        inputPassword
      );
      if(inputPasswordHash === storedPasswordHash){
        return true;
      }
      else{
        return false;
      }
    } catch (error) {
      console.error('Błąd podczas porównywania haseł:', error);
      return false;
    }
  };
  
  const login = async () => {
    if (loginData.login && loginData.password) {
      try {
        const response = await fetch(`${BASE_URL}/users`); 
        const users = await response.json(); 
        
        const user = users.find(user => user.login === loginData.login);

        if (user) {
          const isPasswordValid = await comparePasswords(loginData.password, user.password);
          if (isPasswordValid) {
            await SecureStore.setItemAsync('userData', JSON.stringify({ login: loginData.login, password: loginData.password }));
            loginUser(user);
            navigation.navigate('Main');
          } else {
            Vibration.vibrate(500);
            Alert.alert('Błąd', 'Hasło jest niepoprawne');
          }
        } else {
          Vibration.vibrate(500);
          Alert.alert('Błąd', 'Użytkownik nie istnieje');
        }
      } catch (error) {
        console.error('Błąd przy logowaniu:', error);
        Alert.alert('Błąd', 'Wystąpił błąd przy logowaniu');
      }
    } else {
      Vibration.vibrate(500);
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
