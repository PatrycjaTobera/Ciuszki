import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

function Search({ navigation }) {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const fetchAds = async () => {
    try {
      const response = await fetch(`${BASE_URL}/ads`);
      const adsData = await response.json();
      
      const usersResponse = await fetch(`${BASE_URL}/users`);
      const users = await usersResponse.json();

      const allOrders = users.reduce((orders, u) => {
        return [...orders, ...u.orders];
      }, []);

      const filteredAds = adsData.filter((ad) => !allOrders.includes(ad.id));

      const finalAds = loggedInUser ? filteredAds.filter((ad) => !(loggedInUser.ads || []).includes(ad.id)) : filteredAds;

      setAds(finalAds);
    } catch (error) {
      console.error('Błąd pobierania ogłoszeń:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchLoggedInUser();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      fetchAds();
    }
  }, [loggedInUser]);

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wyszukaj ogłoszenia</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Wpisz tytuł lub opis"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Ad', { adId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardPrice}>{item.price} PLN</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Search;
