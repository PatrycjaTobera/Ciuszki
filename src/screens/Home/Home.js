import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import styles from './styles';
import { useBaseUrl } from '../../contexts/BaseUrlContext';

function Home({ navigation }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const BASE_URL = useBaseUrl();

  const fetchLoggedInUser = async () => {
    try {
      const savedUserData = await SecureStore.getItemAsync('userData');
      if (savedUserData) {
        const { login } = JSON.parse(savedUserData);
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();
        const user = users.find((u) => u.login === login);
        setLoggedInUser(user);
      } else {
        Alert.alert('Błąd', 'Nie udało się załadować danych użytkownika.');
      }
    } catch (error) {
      console.error('Błąd przy ładowaniu danych użytkownika:', error);
      Alert.alert('Błąd', 'Nie udało się załadować danych użytkownika.');
    }
  };

  const fetchAds = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/ads`);
      const adsData = await response.json();
      const usersResponse = await fetch(`${BASE_URL}/users`);
      const users = await usersResponse.json();

      const allOrders = users.reduce((orders, u) => {
        return [...orders, ...u.orders];
      }, []);

      const filteredAds = adsData.filter((ad) => !allOrders.includes(ad.id));

      const finalAds = user ? filteredAds.filter((ad) => !(user.ads || []).includes(ad.id)) : filteredAds;

      setAds(finalAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await fetchLoggedInUser();
      };
      loadData();
    }, [])
  );

  useEffect(() => {
    if (loggedInUser) {
      fetchAds(loggedInUser);
    }
  }, [loggedInUser]);

  const goToAd = (adId) => {
    navigation.navigate('Ad', { adId });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Ładowanie ogłoszeń...</Text>
        </View>
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToAd(item.id)} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Cena: {item.price} PLN</Text>
              <Text style={styles.size}>Rozmiar: {item.size}</Text>
              <Text style={styles.brand}>Marka: {item.brand}</Text>
              <View style={styles.images}>
                {item.images.map((image, index) => {
                  const imageUrl = image.startsWith('http') ? image : `https://res.cloudinary.com/your-cloud-name/image/upload/${image}`;
                  return (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.image}
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default Home;
