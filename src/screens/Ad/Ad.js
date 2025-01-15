import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, Button } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

function Ad({ route, navigation }) {
  const { adId } = route.params;
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL = useBaseUrl();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const adResponse = await fetch(`${BASE_URL}/ads/${adId}`);
        const adData = await adResponse.json();
        setAd(adData);

        const usersResponse = await fetch(`${BASE_URL}/users`);
        const usersData = await usersResponse.json();
        const foundUser = usersData.find((user) => user.ads.includes(adId));
        setUser(foundUser); 
      } catch (error) {
        console.error('Błąd podczas pobierania ogłoszenia lub użytkownika:', error);
      }
    };

    fetchAd();
  }, [adId]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  if (!ad) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Ładowanie ogłoszenia...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {ad.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      <View style={styles.imageIndicatorContainer}>
        {ad.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              {
                backgroundColor: index === currentIndex ? '#fc20a4' : '#d3d3d3',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{ad.title}</Text>
        <Text style={styles.description}>{ad.description}</Text>
        <Text style={styles.category}>Kategoria: {ad.category}</Text>
        <Text style={styles.brand}>Marka: {ad.brand}</Text>
        <Text style={styles.price}>Cena: {ad.price} PLN</Text>
        <Text style={styles.size}>Rozmiar: {ad.size}</Text>
      </View>

      {user && (
        <View style={styles.userContainer}>
          <Image
            source={{ uri: user.profilePicture}}
            style={styles.profilePicture}
          />
          <Text style={styles.seller}>Informacje o sprzedającym</Text>
          <Text style={styles.login}>{user.login}</Text>
          <Text style={styles.adsCount}>
            Liczba ogłoszeń tego użytkownika: {user.ads.length}
          </Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.buttonText}>Napisz do sprzedającego</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Dodaj do koszyka</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

export default Ad;
