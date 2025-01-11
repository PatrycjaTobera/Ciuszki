import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Button, Divider } from 'react-native-paper';
import styles from './styles';
import { useBaseUrl } from '../../contexts/BaseUrlContext';

function Settings({ navigation }) {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState(''); 
  
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
      return inputPasswordHash === storedPasswordHash;
    } catch (error) {
      console.error('Błąd podczas porównywania haseł:', error);
      return false;
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Błąd', 'Proszę wprowadzić obecne hasło.');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Błąd', 'Proszę wprowadzić nowe hasło oraz potwierdzenie hasła.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła się nie zgadzają.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users?login=${loginData.login}`);
      const users = await response.json();
      
      const user = users.find(user => user.login === loginData.login); 

      if (user) {
        const isPasswordValid = await comparePasswords(currentPassword, user.password);

        if (isPasswordValid) {
          const newPasswordHash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
          );

          const updateResponse = await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPasswordHash }),
          });

          if (updateResponse.ok) {
            Alert.alert('Sukces', 'Hasło zostało zmienione.');
            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');
          } else {
            Alert.alert('Błąd', 'Nie udało się zmienić hasła. Spróbuj ponownie.');
          }
        } else {
          Alert.alert('Błąd', 'Obecne hasło jest niepoprawne.');
        }
      } else {
        Alert.alert('Błąd', 'Użytkownik nie istnieje.');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd przy zmianie hasła.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Błąd', 'Proszę wprowadzić obecne hasło, aby usunąć konto.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users?login=${loginData.login}`);
      const users = await response.json();
      
      const user = users.find(user => user.login === loginData.login); 

      if (user) {
        const isPasswordValid = await comparePasswords(deletePassword, user.password);

        if (isPasswordValid) {
          const deleteResponse = await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (deleteResponse.ok) {
            Alert.alert('Sukces', 'Twoje konto zostało usunięte.');
            await SecureStore.deleteItemAsync('userData');
            navigation.navigate('Login'); 
          } else {
            Alert.alert('Błąd', 'Nie udało się usunąć konta. Spróbuj ponownie.');
          }
        } else {
          Alert.alert('Błąd', 'Podane hasło jest niepoprawne.');
        }
      } else {
        Alert.alert('Błąd', 'Użytkownik nie istnieje.');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd przy usuwaniu konta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Ustawienia</Text>

      <Text style={styles.header}>Zmień hasło</Text>
      <TextInput
        style={styles.input}
        placeholder="Obecne hasło"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nowe hasło"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Potwierdź nowe hasło"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        style={styles.button}
      >
        Zmień hasło
      </Button>

      <Divider style={styles.divider} />

      <Text style={styles.header}>Usuń konto</Text>
      <TextInput
        style={styles.input}
        placeholder="Obecne hasło"
        secureTextEntry
        value={deletePassword}
        onChangeText={setDeletePassword}
      />

      <Button
        mode="contained"
        onPress={handleDeleteAccount}
        style={[styles.button, { backgroundColor: '#d9534f' }]}
      >
        Usuń konto
      </Button>

      <Divider style={styles.divider} />
    </View>
  );
}

export default Settings;
