import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, ScrollView, Vibration, Modal, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djgma8pik/image/upload';
const UPLOAD_PRESET = 'Ciuszki';

function NewAd() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Odzież');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [images, setImages] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const categories = ['Odzież', 'Akcesoria'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const BASE_URL = useBaseUrl();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await SecureStore.getItemAsync('userData');
        if (savedUserData) {
          const { login } = JSON.parse(savedUserData);

          const response = await axios.get(`${BASE_URL}/users`);
          const users = response.data;
          const user = users.find((u) => u.login === login);

          if (user) {
            setLoggedInUser(user);
          } else {
            Alert.alert('Błąd', 'Nie znaleziono zalogowanego użytkownika.');
          }
        }
      } catch (error) {
        console.error('Błąd przy ładowaniu danych użytkownika:', error);
        Alert.alert('Błąd', 'Nie udało się załadować danych użytkownika.');
      }
    };

    loadUserData();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Wymagane jest pozwolenie na dostęp do galerii!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const uploadedImages = await Promise.all(
          result.assets.map(async (asset) => {
            const formData = new FormData();
            formData.append('file', {
              uri: asset.uri,
              type: 'image/jpeg',
              name: 'ad_image.jpg',
            });
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await axios.post(CLOUDINARY_URL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (response.status === 200) {
              return response.data.secure_url;
            } else {
              throw new Error('Nie udało się przesłać obrazu.');
            }
          })
        );

        setImages((prevImages) => [...prevImages, ...uploadedImages]);
      } catch (error) {
        console.error('Błąd przesyłania obrazów:', error);
        Alert.alert('Błąd', 'Nie udało się przesłać jednego lub więcej obrazów. Spróbuj ponownie.');
      }
    }
  };

  const handleSubmit = async () => {
    const priceValue = parseFloat(price.replace(',', '.'));
    const priceRegex = /^\d+(\.\d{1,2})?$/;
  
    if (!title || !description || !price || !brand || images.length === 0) {
      Vibration.vibrate(500);
      Alert.alert('Błąd', 'Wszystkie pola muszą być wypełnione, w tym dodanie przynajmniej jednego zdjęcia.');
      return;
    }
  
    if (!priceRegex.test(price.replace(',', '.')) || priceValue <= 0) {
      Alert.alert('Błąd', 'Cena musi być liczbą większą od 0 i zawierać maksymalnie dwie liczby po przecinku.');
      return;
    }
  
    const newAd = {
      title,
      description,
      price: priceValue,
      category,
      brand,
      ...(size && { size }),
      images,
    };
  
    try {
      const adResponse = await axios.post(`${BASE_URL}/ads`, newAd, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (adResponse.status === 201) {
        const adData = adResponse.data;
        const updatedAds = [...(loggedInUser.ads || []), adData.id];
        const userUpdateResponse = await axios.patch(`${BASE_URL}/users/${loggedInUser.id}`, {
          ads: updatedAds,
        });

  
        if (userUpdateResponse.status === 200) {
          Alert.alert('Sukces', 'Ogłoszenie zostało dodane!');
          setTitle('');
          setDescription('');
          setPrice('');
          setBrand('');
          setSize('');
          setImages([]);
        } else {
          throw new Error('Nie udało się zaktualizować użytkownika.');
        }
      } else {
        throw new Error('Nie udało się dodać ogłoszenia.');
      }
    } catch (error) {
      console.error('Błąd dodawania ogłoszenia:', error);
      Alert.alert('Błąd', `Wystąpił błąd przy dodawaniu ogłoszenia: ${error.message}`);
    }
  };
  

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (newCategory === 'Akcesoria') {
      setSize(''); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Dodaj przedmiot</Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleImageUpload}
        >
          <Text style={styles.buttonText}>Wybierz zdjęcia</Text>
        </TouchableOpacity>
        <View style={styles.imagesPreview}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tytuł"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Opis"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Marka"
        value={brand}
        onChangeText={setBrand}
      />

      <Text style={styles.label}>Wybierz kategorię</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={styles.buttonText}>{category}</Text>
      </TouchableOpacity>

      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => {
                  handleCategoryChange(cat);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {category !== 'Akcesoria' && (
        <>
          <View style={styles.spacer} />
          <Text style={styles.label}>Wybierz rozmiar</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSizeModalVisible(true)}
          >
            <Text style={styles.buttonText}>{size || 'Wybierz'}</Text>
          </TouchableOpacity>

          <Modal
            visible={sizeModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSizeModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {sizes.map((sz, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => {
                      setSize(sz);
                      setSizeModalVisible(false);
                    }}
                  >
                    <Text style={styles.buttonText}>{sz}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </>
      )}

      <Divider style={styles.divider} />
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Dodaj ogłoszenie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default NewAd;