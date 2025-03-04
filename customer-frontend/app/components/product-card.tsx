import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardProps {
  imageUri: string;
  name: string;
  color: string;
  size: string;
  orderID: string;
  ordered: string;
  received: string;
  price: string;
  isSelected?: boolean;
}

export default function ProductCard({
  imageUri,
  name,
  color,
  size,
  orderID,
  ordered,
  received,
  price,
  isSelected = false,
}: ProductCardProps) {
  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <Image source={{ uri: imageUri || 'https://via.placeholder.com/100' }} style={styles.image} />
      <Text style={[styles.price, { fontFamily: 'Shippori-Antique' }]}>${price}</Text>
      <View style={styles.details}>
        <Text style={[styles.name, { fontFamily: 'Shippori-Antique' }]}>{name}</Text>
        <Text style={[styles.info]}>Color: {color}</Text>
        <Text style={[styles.info]}>Size: {size}</Text>
        <Text style={[styles.info]}>Order ID: {orderID}</Text>
        <Text style={[styles.info]}>Ordered: {ordered}</Text>
        <Text style={[styles.info]}>Received: {received}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    width: 300,
    height: 120,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: 'black',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
  },
  details: {
    flex: 1,
    position: 'relative',
    left: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  info: {
    fontSize: 12,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    left: 20,
    bottom: 15,
  },
});
