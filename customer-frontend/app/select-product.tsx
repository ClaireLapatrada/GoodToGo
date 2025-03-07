// SelectProduct.tsx
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchData } from '@/app/api/product-img/route';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import ProductCard from './components/product-card';
import { ProductContext } from '@/app/productContext';

interface RecommendedAction {
  action: string;
  value: number;
}

interface Product {
  name: string;
  id: string;
  price: number;
  ordered: string;
  received: string;
  condition?: string;
  estimatedRefundValue?: number;
  eligibleForResale?: boolean;
  repairsNeeded?: boolean;
  recommendedAction?: string;
  isWardrobing?: boolean;
  image?: any;
  size?: string;
  color?: string;
}

interface SelectProductProps {
  product: Product | null;
  setProduct: (product: Product) => void;
}

const SelectProduct: React.FC = () => {
  const { product, setProduct } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
  });

  const handleButtonClick = () => {
    if (selectedProduct) {
      const productToSet = {
        name: selectedProduct.name,
        id: selectedProduct.id,
        price: selectedProduct.price,
        ordered: selectedProduct.ordered,
        received: selectedProduct.received,
      };
      setProduct(productToSet);
      router.push('/show-product');
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await fetchData();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getMessage();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Fixed product definitions with proper image handling
  const products = [
    { 
      name: "Product A", 
      id: "123", 
      size: "M", 
      color: "Black", 
      price: 99.99, 
      ordered: "2025-03-05", 
      received: "2025-03-05", 
      image: require('../assets/images/blacktshirt.png')
    },
    { 
      name: "Product B", 
      id: "456", 
      size: "L", 
      color: "White", 
      price: 199.99, 
      ordered: "2025-03-05", 
      received: "2025-03-05", 
      image: require('../assets/images/aj1.png')
    },
    { 
      name: "Product C", 
      id: "789", 
      size: "S", 
      color: "Red", 
      price: 299.99, 
      ordered: "2025-03-05", 
      received: "2025-03-05", 
      image: require('../assets/images/nikewhite.png')
    },
  ];

  return (
    <View style={styles.pageContainer}>
      <FloatingBlobsBackground />
      <Text style={styles.text}>Begin your return process</Text>
      <Text style={styles.subtext}>Choose a product to return</Text>

      <ScrollView style={styles.cardContainer}>
        {products.map((product, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedProduct(product)}>
            <ProductCard
              imageUri={product.image}
              name={product.name}
              color={product.color || ""}
              size={product.size || ""}
              orderID={product.id}
              ordered={product.ordered}
              received={product.received}
              price={product.price.toString()}
              isSelected={selectedProduct?.name === product.name}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Fixed Selection Tab */}
      {selectedProduct && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>{selectedProduct.name}</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleButtonClick}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 50,
  },
  text: {
    fontSize: 22,
    color: 'black',
    alignSelf: 'flex-start',
    paddingTop: 100,
    fontFamily: 'Shippori-Antique',
  },
  subtext: {
    fontSize: 14,
    color: '#3e3e3e',
    alignSelf: 'flex-start',
    paddingTop: 5,
    paddingBottom: 30,
  },
  cardContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 100,
  },
  selectedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  selectedText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Shippori-Antique',
  },
  continueButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
  },
});

export default SelectProduct;