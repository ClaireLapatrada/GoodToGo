import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing, Image } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

  const handleMenuClick = () => {
    router.push('/')
  }

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
      toValue: -80, // Adjusted to a smaller value
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.pageContainer}>
      <FloatingBlobsBackground />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Animated.Text
        style={[
          styles.text,
          { fontFamily: 'Shippori-Antique', transform: [{ translateY: textTranslateY }] },
        ]}
      >
        Your item is Good to Go?
      </Animated.Text>
      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      alignItems: 'center', // Center items horizontally
      paddingHorizontal: 50,
    },
    menuButton: {
      position: 'absolute',
      top: 70, // Adjust top spacing
      left: 50, // Align to the left
    },
    text: {
      fontSize: 24,
      color: 'black',
      marginBottom: 20,
      alignSelf: 'center',
      position: 'absolute',
      top: 600, // Adjust top spacing

    },
    buttonContainer: {
      alignSelf: 'center', // Align button to the left
      position: 'absolute',
      top: 670, // Adjust top spacing

    },
    button: {
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },

    logo: {
      width: 200,
      height: 310,
      marginBottom: 20,
      justifyContent: 'center',
      position: 'absolute',
      top: 140,

    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      textAlign: 'center',
    },
  });
  
  