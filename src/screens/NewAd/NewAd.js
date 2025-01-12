import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, ScrollView, Vibration } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';  
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import styles from './styles';

function NewAd() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Odzież');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('S');
  const [images, setImages] = useState([]);

  const categories = ['Odzież', 'Akcesoria'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const BASE_URL = useBaseUrl();
  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !brand || images.length === 0) {
      Vibration.vibrate(500);
      Alert.alert('Błąd', 'Wszystkie pola muszą być wypełnione, w tym dodanie przynajmniej jednego zdjęcia.');
      return;
    }

    const newAd = {
      title,
      description,
      price: parseFloat(price),
      category,
      brand,
      size,
      images: images.map((image) => image.uri),
    };

    try {
      const response = await fetch(`${BASE_URL}/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAd),
      });
      const data = await response.json();
      alert('Ogłoszenie zostało dodane!');
      setTitle('');
      setDescription('');
      setPrice('');
      setBrand('');
      setSize('S');
      setImages([]);
    } catch (error) {
      console.error('Błąd dodawania ogłoszenia:', error);
      alert('Wystąpił błąd przy dodawaniu ogłoszenia.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dodaj przedmiot</Text>

      <View style={styles.uploadContainer}>
        <Button title="Wybierz zdjęcia" onPress={handleImageUpload} />
        <View style={styles.imagesPreview}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
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

      <Text style={styles.label}>Wybierz kategorię</Text>

      <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Marka"
        value={brand}
        onChangeText={setBrand}
      />

      <Text style={styles.label}>Wybierz rozmiar</Text>

      <Picker selectedValue={size} onValueChange={(itemValue) => setSize(itemValue)} style={styles.picker}>
        {sizes.map((sz, index) => (
          <Picker.Item key={index} label={sz} value={sz} />
        ))}
      </Picker>

      <Button title="Dodaj ogłoszenie" onPress={handleSubmit} />
    </ScrollView>
  );
}

export default NewAd;
