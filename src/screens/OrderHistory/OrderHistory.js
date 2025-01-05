import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function OrderHistory() {
  return (
    <View style={styles.container}>
      <Text>Order History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderHistory;
