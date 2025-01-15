import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; 
import styles from './styles';

function YourAds({ navigation }) {
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = useBaseUrl();

  const loadUserAds = async () => {
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
          const userAdsIds = loggedInUser.ads || [];
          const filteredAds = ads.filter(ad => userAdsIds.includes(ad.id));
          setUserAds(filteredAds);
        }
      }
    } catch (error) {
      console.error('Błąd przy ładowaniu ogłoszeń użytkownika:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserAds();
    }, [])
  );

  const goToAd = (adId) => {
    navigation.navigate('Ad', { adId });
  };

  const handleEdit = (adId) => {
    navigation.navigate('EditAd', { adId });
  };


  const handleDelete = async (adId) => {
    Alert.alert(
      'Usuń ogłoszenie',
      'Czy na pewno chcesz usunąć to ogłoszenie?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          onPress: async () => {
            try {
              const response = await axios.delete(`${BASE_URL}/ads/${adId}`);
              if (response.status === 200) {
                const savedUserData = await SecureStore.getItemAsync('userData');
                if (savedUserData) {
                  const { login } = JSON.parse(savedUserData);

                  const usersResponse = await axios.get(`${BASE_URL}/users`);
                  const users = usersResponse.data;

                  const loggedInUser = users.find(user => user.login === login);
                  if (loggedInUser) {
                    const updatedAds = loggedInUser.ads.filter((id) => id !== adId);

                    await axios.put(`${BASE_URL}/users/${loggedInUser.id}`, {
                      ...loggedInUser,
                      ads: updatedAds,
                    });

                    setUserAds((prevAds) => prevAds.filter(ad => ad.id !== adId));
                    Alert.alert('Sukces', 'Ogłoszenie zostało usunięte.');
                  }
                }
              }
            } catch (error) {
              console.error('Błąd przy usuwaniu ogłoszenia:', error);
              Alert.alert('Błąd', 'Nie udało się usunąć ogłoszenia.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <Text>Ładowanie ogłoszeń...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje ogłoszenia</Text>
      <FlatList
        data={userAds}
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
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleEdit(item.id)}
                style={styles.editButton}
              >
                Edytuj
              </Button>
              <Button
                mode="contained"
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                Usuń
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default YourAds;
