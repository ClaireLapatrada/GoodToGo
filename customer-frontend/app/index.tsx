import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing } from 'react-native';
import { fetchData } from '@/app/api/product-img/route';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
  });

  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleButtonClick = () => {
    // Use router.push to navigate to the details page
    router.push('/select-product');
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await fetchData();
        setMessage(data);
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

  const textTranslateY = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(0);
  const buttonOpacity = new Animated.Value(0);

  const moveTextUp = () => {
    Animated.timing(textTranslateY, {
      toValue: -100,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    moveTextUp();
    fadeInButton();
    moveButtonUp();
  }, []);

  const fadeInButton = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const moveButtonUp = () => {
    Animated.timing(buttonTranslateY, {
      toValue: -50, // Adjusted to a smaller value
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.pageContainer}>
      <FloatingBlobsBackground />
      <Animated.Text
        style={[
          styles.text,
          { fontFamily: 'Shippori-Antique', transform: [{ translateY: textTranslateY }] },
        ]}
      >
        Your item is Good to Go?
      </Animated.Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Return item</Text>
        </TouchableOpacity>
      {/* <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Return item</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20, // Add margin to separate text and button
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});