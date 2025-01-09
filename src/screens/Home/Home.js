import React, { useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import {useBaseUrl} from '../../contexts/BaseUrlContext';

function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); 

  const BASE_URL = useBaseUrl();

  const fetchAds = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`${BASE_URL}/ads`);
      const data = await response.json();
      setAds(data); 
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAds();
    }, [])
  );

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
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Cena: {item.price} PLN</Text>
              <Text style={styles.size}>Rozmiar: {item.size}</Text>
              <Text style={styles.brand}>Marka: {item.brand}</Text>
              <View style={styles.images}>
                {item.images.map((image, index) => {
                  const isLocalImage = image.startsWith('file://');
                  return (
                    <Image
                      key={index}
                      source={{ uri: isLocalImage ? image : `${BASE_URL}/${image}` }}
                      style={styles.image}
                    />
                  );
                })}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

export default Home;
