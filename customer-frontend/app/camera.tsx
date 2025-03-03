import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchData } from '@/app/api/product-img/route';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


export default function Camera() {
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const router = useRouter();
    const [fontsLoaded] = useFonts({
      'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    });
  
    const handleButtonClick = () => {
      // Use router.push to navigate to the details page
      router.push('/');
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
  
    const products = [
      { name: "Product A", color: "Red", size: "M" },
      { name: "Product B", color: "Blue", size: "L" },
      { name: "Product C", color: "Green", size: "S" },
    ];
  
    return (
      <View style={styles.pageContainer}>
        <FloatingBlobsBackground />
        <Text style={styles.text}>Show us what's wrong with the product</Text>

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      paddingLeft: 50,
    },
    text: {
      fontSize: 22,
      color: 'black',
      alignSelf: 'flex-start',
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
  