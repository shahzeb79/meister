// app/index.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Maps() {
  const handlePress = () => {
    alert('Button Pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Welcome to React Native Expo!</Text>
      <Button title="Press me" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
