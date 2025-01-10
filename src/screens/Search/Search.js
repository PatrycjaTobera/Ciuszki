import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

function Search({ navigation }) {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const BASE_URL = useBaseUrl();
  useEffect(() => {
    fetch(`${BASE_URL}/ads`)
      .then((response) => response.json())
      .then((data) => setAds(data))
      .catch((error) => console.error('Błąd pobierania ogłoszeń:', error));
  }, []);

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
