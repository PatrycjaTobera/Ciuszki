import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from './styles';

const Basket = ({ route, navigation }) => {
  const [basketItems, setBasketItems] = useState([]);
  const deliveryFee = 20;

  useEffect(() => {
    if (route.params?.adToAdd) {
      const existingItem = basketItems.find(item => item.id === route.params.adToAdd.id);
      
      if (!existingItem) {
        setBasketItems((prevItems) => [...prevItems, route.params.adToAdd]);
      }
    }
  }, [route.params?.adToAdd]);

  const removeFromBasket = (id) => {
    setBasketItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = basketItems.reduce((acc, item) => acc + item.price, 0) + deliveryFee;

  const handlePayment = () => {
    navigation.navigate('Payment', { basketItems, totalPrice });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Koszyk</Text>

      <FlatList
        data={basketItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>Cena: {item.price} PLN</Text>
            <Text style={styles.size}>Rozmiar: {item.size}</Text>
            <Text style={styles.brand}>Marka: {item.brand}</Text>
            <View style={styles.images}>
              {item.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromBasket(item.id)}
            >
              <Text style={styles.removeButtonText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {basketItems.length > 0 ? (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Suma: {totalPrice - deliveryFee} PLN</Text>
          <Text style={styles.summaryText}>Wysyłka: {deliveryFee} PLN</Text>
          <Text style={styles.summaryTotal}>Łącznie: {totalPrice} PLN</Text>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Zapłać</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.emptyText}>Twój koszyk jest pusty.</Text>
      )}
    </View>
  );
};

export default Basket;

