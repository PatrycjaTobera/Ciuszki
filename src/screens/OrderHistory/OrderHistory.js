import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';

function OrderHistory({ navigation }) {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = useBaseUrl();

  const loadUserOrders = async () => {
    try {
      const savedUserData = await SecureStore.getItemAsync('userData');
      if (savedUserData) {
        const { login } = JSON.parse(savedUserData);

        const usersResponse = await axios.get(`${BASE_URL}/users`);
        const adsResponse = await axios.get(`${BASE_URL}/ads`);

        const users = usersResponse.data;
        const ads = adsResponse.data;

        const loggedInUser = users.find(user => user.login === login);

        if (loggedInUser) {
          const userOrderIds = loggedInUser.orders || [];
          const filteredOrders = ads.filter(ad => userOrderIds.includes(ad.id));
          setUserOrders(filteredOrders);
        }
      }
    } catch (error) {
      console.error('Błąd przy ładowaniu zamówień użytkownika:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserOrders();
    }, [])
  );

  const goToAd = (adId) => {
    navigation.navigate('Ad', { adId });
  };

  if (loading) {
    return <Text>Ładowanie zamówień...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje zamówienia</Text>
      <FlatList
        data={userOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => goToAd(item.id)}>
              <Text style={styles.adTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Cena: {item.price} PLN</Text>
              {item.size && <Text style={styles.size}>Rozmiar: {item.size}</Text>}
              <Text style={styles.brand}>Marka: {item.brand}</Text>
              <View style={styles.images}>
                {item.images.map((image, index) => {
                  const isLocalImage = image.startsWith('file://');
                  return (
                    <Image
                      key={index}
                      source={{ uri: isLocalImage ? image : image }}
                      style={styles.image}
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default OrderHistory;
