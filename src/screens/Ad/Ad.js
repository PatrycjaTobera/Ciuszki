import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles'; 

function Ad({ route }) {
  const { adId } = route.params;
  const [ad, setAd] = useState(null);
  const BASE_URL = useBaseUrl();
  useEffect(() => {
    fetch(`${BASE_URL}/ads/${adId}`)
      .then((response) => response.json())
      .then((data) => setAd(data))
      .catch((error) => console.error('Error fetching ad:', error));
  }, [adId]);

  if (!ad) {
    return (
      <View style={styles.container}>
        <Text>Ładowanie ogłoszenia...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ad.title}</Text>
      <Text style={styles.description}>{ad.description}</Text>
      <Text style={styles.price}>{ad.price} PLN</Text>
      <Text style={styles.size}>Rozmiar: {ad.size}</Text>
      <Text style={styles.brand}>Marka: {ad.brand}</Text>

      <ScrollView horizontal contentContainerStyle={styles.images}>
        {ad.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: `${BASE_URL}/${image}` }}
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default Ad;
