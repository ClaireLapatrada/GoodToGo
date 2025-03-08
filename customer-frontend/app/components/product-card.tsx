// components/product-card.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardProps {
  imageUri: any;
  name: string;
  color: string;
  size: string;
  orderID: string;
  ordered: string;
  received: string;
  price: string;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUri,
  name,
  color,
  size,
  orderID,
  ordered,
  received,
  price,
  isSelected,
}) => {
  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <View style={styles.imageContainer}>
        <Image 
          source={imageUri} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Color: {color}</Text>
        <Text style={styles.details}>Size: {size}</Text>
        <Text style={styles.details}>Order ID: {orderID}</Text>
        <Text style={styles.details}>Ordered: {ordered}</Text>
        <Text style={styles.details}>Received: {received}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#000',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Shippori-Antique',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    position: 'absolute',
    left: -93,
    bottom: 0,
  },
});

export default ProductCard;