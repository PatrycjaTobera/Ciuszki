import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import * as Crypto from 'expo-crypto';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

function Registration({ navigation }) {
  const [registerData, setRegisterData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });

  const BASE_URL = useBaseUrl();
  
  const handleRegister = async () => {
    const { login, password, confirmPassword } = registerData;

    if (!login || !password || !confirmPassword) {
      Vibration.vibrate(500);
      Alert.alert('Błąd', 'Wszystkie pola są wymagane');
      return;
    }

    if (password !== confirmPassword) {
      Vibration.vibrate(500);
      Alert.alert('Błąd', 'Hasła nie identyczne, wprowadz hasło ponownie.');
      return;
    }

    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password 
      );
      const newUser = {
        login,
        password: hashedPassword,
        balance: 0,
        about: '',
        profilePicture: '',
        ads: []
      };

      const response = await fetch(`${BASE_URL}/users`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        Alert.alert('Sukces', 'Rejestracja zakończona sukcesem');
        navigation.navigate('Login');
      } else {
        Alert.alert('Błąd', 'Nie udało się zarejestrować');
      }
    } catch (error) {
      console.error('Błąd przy rejestracji:', error);
      Alert.alert('Błąd', 'Wystąpił błąd przy rejestracji');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Ciuszki</Text>

      <Text style={styles.header}>Rejestracja</Text>

      <TextInput
        style={styles.input}
        placeholder="Login"
        value={registerData.login}
        onChangeText={(text) => setRegisterData({ ...registerData, login: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        value={registerData.password}
        onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Potwierdź hasło"
        secureTextEntry
        value={registerData.confirmPassword}
        onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Powrót do logowania</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Registration;
