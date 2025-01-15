import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, ScrollView, Modal, TouchableOpacity} from 'react-native';
import { Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djgma8pik/image/upload';
const UPLOAD_PRESET = 'Ciuszki';

function EditAd({ route, navigation }) {
  const { adId } = route.params;
  const [adDetails, setAdDetails] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Odzież',
    brand: '',
    size: '',
    images: [],
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const categories = ['Odzież', 'Akcesoria'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const BASE_URL = useBaseUrl();

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ads/${adId}`);
        if (response.status === 200) {
          setAdDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching ad details:', error);
        Alert.alert('Błąd', 'Nie udało się załadować danych ogłoszenia.');
      }
    };

    fetchAdDetails();
  }, [adId]);

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

        setAdDetails((prevDetails) => ({
          ...prevDetails,
          images: [...prevDetails.images, ...uploadedImages],
        }));
      } catch (error) {
        console.error('Błąd przesyłania obrazów:', error);
        Alert.alert('Błąd', 'Nie udało się przesłać jednego lub więcej obrazów. Spróbuj ponownie.');
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setAdDetails((prevDetails) => ({
      ...prevDetails,
      images: prevDetails.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    const { title, description, price, brand, images, category, size } = adDetails;

    const priceValue = parseFloat(price.replace(',', '.'));
    const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!priceRegex.test(priceValue) || priceValue <= 0) {
      Alert.alert('Błąd', 'Cena musi być liczbą większą od 0 i zawierać maksymalnie dwie liczby po przecinku.');
      return;
    }

    const updatedAd = {
      id: adId,
      title: title.trim(),
      description: description.trim(),
      price: priceValue,
      category,
      brand: brand.trim(),
      size: category !== 'Akcesoria' ? size : undefined,
      images,
    };

    try {
      const response = await axios.put(`${BASE_URL}/ads/${adId}`, updatedAd);
      if (response.status === 200) {
        Alert.alert('Sukces', 'Ogłoszenie zostało zaktualizowane!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Błąd przy edytowaniu ogłoszenia:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować ogłoszenia.');
    }
  };

  const handleCategoryChange = (newCategory) => {
    setAdDetails((prevDetails) => ({
      ...prevDetails,
      category: newCategory,
    }));

    if (newCategory === 'Akcesoria') {
      setAdDetails((prevDetails) => ({
        ...prevDetails,
        size: '', 
      }));
    }
  };

  const handleBrandChange = (text) => {
    setAdDetails((prevDetails) => ({
      ...prevDetails,
      brand: text,
    }));
  };

  const handleSizeChange = (newSize) => {
    setAdDetails((prevDetails) => ({
      ...prevDetails,
      size: newSize,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Edytuj ogłoszenie</Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleImageUpload}
        >
          <Text style={styles.buttonText}>Wybierz zdjęcia</Text>
        </TouchableOpacity>
        <View style={styles.imagesPreview}>
          {adDetails.images.map((image, index) => (
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
        value={adDetails.title}
        onChangeText={(text) => setAdDetails({ ...adDetails, title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Opis"
        value={adDetails.description}
        onChangeText={(text) => setAdDetails({ ...adDetails, description: text })}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        value={adDetails.price.toString()} 
        onChangeText={(text) => setAdDetails({ ...adDetails, price: text })}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Marka"
        value={adDetails.brand}
        onChangeText={handleBrandChange}
      />

      <Text style={styles.label}>Wybierz kategorię</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={styles.buttonText}>{adDetails.category}</Text>
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

      {adDetails.category !== 'Akcesoria' && (
        <>
          <View style={styles.spacer} />
          <Text style={styles.label}>Wybierz rozmiar</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSizeModalVisible(true)}
          >
            <Text style={styles.buttonText}>{adDetails.size || 'Wybierz'}</Text>
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
                      handleSizeChange(sz);
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
        <Text style={styles.buttonText}>Zaktualizuj ogłoszenie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default EditAd;
