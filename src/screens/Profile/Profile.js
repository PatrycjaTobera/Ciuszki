import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Avatar, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'; 
import styles from './styles';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djgma8pik/image/upload';
const UPLOAD_PRESET = 'Ciuszki';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [user, setUser] = useState(null);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      about: '', 
    },
  });

  const BASE_URL = useBaseUrl(); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await SecureStore.getItemAsync('userData');
        if (savedUserData) {
          const { login } = JSON.parse(savedUserData);

          const response = await axios.get(`${BASE_URL}/users`); 
          const users = response.data;
          const loggedInUser = users.find(user => user.login === login);

          if (loggedInUser) {
            setUser(loggedInUser);
            setProfilePicture(loggedInUser.profilePicture || profilePicture);
            setValue('about', loggedInUser.about || '');
          }
        }
      } catch (error) {
        console.error('Błąd przy ładowaniu danych użytkownika:', error);
      }
    };

    loadUserData();
  }, []);

  const onSubmit = async data => {
    if (user) {
      setIsEditing(false);
  
      try {
        user.about = data.about;
        user.profilePicture = profilePicture;
  
        const response = await axios.put(`${BASE_URL}/users/${user.id}`, user, { 
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status !== 200) {
          throw new Error('Błąd podczas zapisywania danych na serwerze.');
        }
      } catch (error) {
        console.error('Błąd podczas zapisywania danych:', error);
      }
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted || !cameraPermissionResult.granted) {
      Alert.alert('Permission Required', 'Wymagane jest pozwolenie na dostęp do galerii i aparatu!');
      return;
    }

    const options = [
      { text: 'Zrób zdjęcie', onPress: handleCamera },
      { text: 'Wybierz z galerii', onPress: handleGallery },
      { text: 'Anuluj', style: 'cancel' },
    ];

    Alert.alert('Wybierz opcję', null, options);
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      quality: 1,
    });

    processImage(result);
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    processImage(result);
  };

  const processImage = async (result) => {
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg', 
          name: 'profile_picture.jpg',
        });
        formData.append('upload_preset', UPLOAD_PRESET);
  
        const uploadResponse = await axios.post(CLOUDINARY_URL, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (uploadResponse.status === 200) {
          const uploadedImageUrl = uploadResponse.data.secure_url; 
          setProfilePicture(uploadedImageUrl);

          if (user) {
            try {
              user.profilePicture = uploadedImageUrl;

              const updateResponse = await axios.put(`${BASE_URL}/users/${user.id}`, user, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (updateResponse.status === 200) {
                console.log('Zaktualizowano profil użytkownika z nowym obrazem');
              } else {
                throw new Error('Błąd podczas zapisywania obrazu na serwerze');
              }
            } catch (error) {
              console.error('Błąd podczas zapisywania obrazu:', error);
            }
          }
        } else {
          throw new Error(uploadResponse.data.error.message || 'Błąd przesyłania obrazu.');
        }
      } catch (error) {
        console.error('Błąd podczas przesyłania obrazu:', error);
        Alert.alert('Błąd', 'Nie udało się przesłać obrazu. Spróbuj ponownie.');
      }
    }
  };

  if (!user) {
    return <Text>Ładowanie danych użytkownika...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Profil</Text>
      <Avatar.Image
        size={200}
        source={{ uri: profilePicture }} 
        style={styles.avatar}
      />
      
      <Text style={styles.userName}>{user.login}</Text>

      {isEditing && (
        <Button 
          mode="contained" 
          onPress={handleImagePick} 
          style={styles.button}
        >
          Dodaj zdjęcie
        </Button>
      )}
      
      <Text style={styles.header}>O tobie...</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="about"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Napisz coś o sobie"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              mode="outlined"
              editable={isEditing}
            />
          )}
        />
        
        <Button
          mode="contained"
          onPress={isEditing ? handleSubmit(onSubmit) : handleEdit}
          style={styles.button}
        >
          {isEditing ? 'Zapisz' : 'Edytuj'}
        </Button>
      </View>
    </View>
  );
}

export default Profile;
