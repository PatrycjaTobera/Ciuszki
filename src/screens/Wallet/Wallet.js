import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper'; 
import { useBaseUrl } from '../../contexts/BaseUrlContext'; 
import * as SecureStore from 'expo-secure-store'; 
import styles from './styles'; 

function Wallet() {
  const [balance, setBalance] = useState(0); 
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null);
  const BASE_URL = useBaseUrl();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await SecureStore.getItemAsync('userData');
        if (savedUserData) {
          const { login } = JSON.parse(savedUserData);
          const response = await fetch(`${BASE_URL}/users`);
          const users = await response.json();
          const loggedInUser = users.find(user => user.login === login);

          if (loggedInUser) {
            setUser(loggedInUser);
            setBalance(loggedInUser.balance || 0); 
          }
        }
      } catch (error) {
        console.error('Błąd przy ładowaniu danych użytkownika');
      }
    };

    loadUserData();
  }, []);

  const updateBalanceInDB = async (newBalance) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };

      try {
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
          throw new Error('Błąd podczas zapisywania salda na serwerze.');
        }
      } catch (error) {
      }
    }
  };

  const addToBalance = () => {
    const value = parseFloat(inputValue.replace(',', '.'));
    const regex = /^\d+(\.\d{1,2})?$/;

    if (!regex.test(inputValue.replace(',', '.'))) {
      Alert.alert('Błąd', 'Proszę wpisać prawidłową kwotę.');
      return;
    }

    if (!isNaN(value) && value > 0) {
      const newBalance = balance + value;
      setBalance(newBalance); 
      setInputValue('');
      updateBalanceInDB(newBalance); 
    } else {
      Alert.alert('Błąd', 'Proszę wpisać kwotę większą od 0.');
    }
  };

  if (!user) {
    return <Text>Ładowanie danych użytkownika...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Saldo Portfela</Text>
      <Text style={styles.balance}>{balance.toFixed(2)} PLN</Text>

      <TextInput
        style={styles.input}
        placeholder="Wpisz kwotę (np. 13.33)"
        keyboardType="numeric"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button
        mode="contained"
        onPress={addToBalance}
        style={styles.button}
      >
        Dodaj kwotę
      </Button>
    </View>
  );
}

export default Wallet;
