import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Wallet() {
  return (
    <View style={styles.container}>
      <Text>Wallet</Text>
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

export default Wallet;
