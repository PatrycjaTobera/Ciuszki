import React, { useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { useBaseUrl } from '../../contexts/BaseUrlContext';

function Home({ navigation }) {
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
