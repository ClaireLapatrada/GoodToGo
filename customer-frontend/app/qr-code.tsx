import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';

export default function QRCodeGenerator() {
  const { product } = useLocalSearchParams(); // Get params from the route

  if (!product) return <Text>No product selected</Text>;

  let parsedProduct;
  try {
    parsedProduct = JSON.parse(product as string); // Ensure it's parsed correctly
  } catch (error) {
    console.error("Error parsing product:", error);
    return <Text>Error loading product</Text>;
  }

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Text>Scan for Product Details:</Text>
      <QRCode value={JSON.stringify(parsedProduct)} size={200} />
    </View>
  );
}
