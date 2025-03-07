import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';

export default function RefundStatus() {
  const router = useRouter();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
          'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
      });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleRefresh = () => {
    console.log('Refreshing status...');
  };

  const handleContinue = () => {
    router.push('/');
  };

  const steps = [
    'Request received',
    'Product shipped',
    'Product received',
    'Refund processed',
  ];

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <FloatingBlobsBackground />
      
      {/* Menu and Refresh Icons */}
      <View style={styles.headerIcons}>
        <MaterialIcons name="menu" size={28} color="black" style={styles.menuIcon} />
      </View>
      
      {/* Status Text */}
      <Text style={styles.title}>Your refund process has been initiated</Text>
      
      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            {index !== 0 && <View style={styles.connector} />} 
            <View style={[styles.stepCircle, index !== 0 && styles.transparentCircle]} />
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
  
      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingHorizontal: 50,
    paddingVertical: 150,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuIcon: {
    alignSelf: 'flex-start',
  },
  refreshIcon: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    marginBottom: 20,
    fontFamily: 'Shippori-Antique',
  },
  progressContainer: {
    alignItems: 'flex-start',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 2,
    height: 68,
    backgroundColor: 'black',
    position: 'absolute',
    left: 7,
    top: -34,
  },
  transparentCircle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'black',
  },
  stepCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'black',
    marginRight: 10,
  },
  stepText: {
    fontSize: 16,
    color: 'black',
    paddingVertical: 30,
    fontFamily: 'Shippori-Antique',
  },
  continueButton: {
    alignSelf: 'center', // Center horizontally
    marginTop: 30, // Add spacing from the progress tracker
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
