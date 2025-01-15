import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import styles from './styles';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useBaseUrl } from '../../contexts/BaseUrlContext';

const Payment = ({ route }) => {
  const { basketItems, totalPrice } = route.params;
  const [userBalance, setUserBalance] = useState(null);
  const baseUrl = useBaseUrl(); 

  useEffect(() => {
    const loadUserBalance = async () => {
      try {
        const savedUserData = await SecureStore.getItemAsync('userData');
        if (savedUserData) {
          const { login } = JSON.parse(savedUserData);

          const response = await axios.get(`${baseUrl}/users`); 
          const users = response.data; 
          const loggedInUser = users.find(user => user.login === login); 

          if (loggedInUser) {
            setUserBalance(loggedInUser.balance); 
          } else {
            Alert.alert('Błąd', 'Nie znaleziono użytkownika.');
          }
        } else {
          Alert.alert('Błąd', 'Nie udało się pobrać danych użytkownika.');
        }
      } catch (error) {
        console.error('Błąd przy ładowaniu danych użytkownika:', error);
        Alert.alert('Błąd', 'Wystąpił błąd przy ładowaniu danych użytkownika.');
      }
    };

    loadUserBalance();
  }, [baseUrl]); 

  const handlePayment = async () => {
    if (userBalance !== null) {
      if (userBalance >= totalPrice) {
        try {
          const savedUserData = await SecureStore.getItemAsync('userData');
          if (savedUserData) {
            const { login } = JSON.parse(savedUserData);

            const response = await axios.get(`${baseUrl}/users`);
            const users = response.data;
            const loggedInUser = users.find(user => user.login === login);

            if (loggedInUser) {
              const updatedBalance = loggedInUser.balance - totalPrice; 

              const updatedOrders = [...loggedInUser.orders, basketItems[0].id]; 

              await axios.put(`${baseUrl}/users/${loggedInUser.id}`, {
                ...loggedInUser,
                balance: updatedBalance,
                orders: updatedOrders,
              });

              await SecureStore.setItemAsync('userData', JSON.stringify({
                ...JSON.parse(savedUserData),
                balance: updatedBalance,
                orders: updatedOrders,
              }));
              Alert.alert('Zakup udany', 'Zakup został pomyślnie zrealizowany.');
            } else {
              Alert.alert('Błąd', 'Nie znaleziono użytkownika.');
            }
          }
        } catch (error) {
          console.error('Błąd przy aktualizacji salda:', error);
          Alert.alert('Błąd', 'Wystąpił błąd przy aktualizacji salda użytkownika.');
        }
      } else {
        Alert.alert(
          'Zasil portfel',
          'Twoje saldo jest niewystarczające. Zasil portfel, aby zakończyć zakupy.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert('Błąd', 'Nie udało się pobrać salda użytkownika.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podsumowanie płatności</Text>
      
      <View style={styles.card}>
        <Text style={styles.summaryText}>Twoje zamówienie:</Text>
        
        <FlatList
          data={basketItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.minifiedItem}>
              <Image
                source={{ uri: item.images[0] }}
                style={styles.minifiedImage}
              />
              <Text style={styles.minifiedTitle}>{item.title}</Text>
              <Text style={styles.minifiedPrice}>{item.price} PLN</Text>
            </View>
          )}
        />
        
        <Text style={styles.summaryTotal}>Łączna kwota: {totalPrice} PLN</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Zatwierdź płatność</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Payment;
