// background-blur.tsx
import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';  // Import BlurView from expo-blur

const FloatingBlobsBackground = () => {
  // Animation values for the blobs
  const blob1TranslateY = new Animated.Value(0);
  const blob2TranslateY = new Animated.Value(0);
  const blob3TranslateY = new Animated.Value(0);

  // Create floating animation for blobs
  const animateBlobs = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob1TranslateY, {
          toValue: -20,
          duration: 3000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(blob1TranslateY, {
          toValue: 0,
          duration: 3000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blob2TranslateY, {
          toValue: -25,
          duration: 3500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(blob2TranslateY, {
          toValue: 0,
          duration: 3500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blob3TranslateY, {
          toValue: -30,
          duration: 4000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(blob3TranslateY, {
          toValue: 0,
          duration: 4000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBlobs(); // Start blob floating animation
  }, []);

  return (
    <View style={styles.container}>
  {/* White background behind the blobs */}
  <View style={styles.whiteBackground} />

  {/* Color blobs with animation */}
  <Animated.View
    style={[styles.blob1, { transform: [{ translateY: blob1TranslateY }] }]}
  />
  <Animated.View
    style={[styles.blob2, { transform: [{ translateY: blob2TranslateY }] }]}
  />
  <Animated.View
    style={[styles.blob3, { transform: [{ translateY: blob3TranslateY }] }]}
  />
  <Animated.View
    style={[styles.blob4, { transform: [{ translateY: blob3TranslateY }] }]}
  />
  <Animated.View
    style={[styles.blob5, { transform: [{ translateY: blob3TranslateY }] }]}
  />
  <Animated.View
    style={[styles.blob6, { transform: [{ translateY: blob3TranslateY }] }]}
  />

  {/* Background blur layer */}
  <BlurView
    style={styles.backgroundBlur}
    intensity={60} // Adjust blur intensity
    tint="light" // Set blur style (light or dark)
  />
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  whiteBackground: {
    position: 'absolute',  // Position the white background at the back
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f4f1e9', // Set background color to white
  },
  blob1: {
    position: 'absolute',
    width: 250,
    height: 150,
    backgroundColor: '#bbd9f8',
    borderRadius: 100,
    top: '20%',
    left: '10%',
    opacity: 0.5,
  },
  blob2: {
    position: 'absolute',
    width: 300,
    height: 180,
    backgroundColor: '#a69de6',
    borderRadius: 150,
    top: '30%',
    left: '50%',
    opacity: 0.4,
  },
  blob3: {
    position: 'absolute',
    width: 250,
    height: 200,
    backgroundColor: '#ebb1a4',
    borderRadius: 200,
    top: '50%',
    left: '70%',
    opacity: 0.4,
  },
  blob4: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: '#ebc9a4',
    borderRadius: 200,
    top: '35%',
    left: '-10%',
    opacity: 0.4,
  },
  blob5: {
    position: 'absolute',
    width: 300,
    height: 150,
    backgroundColor: '#ffd0e0',
    borderRadius: 200,
    top: '50%',
    left: '0%',
    opacity: 0.4,
  },
  blob6: {
    position: 'absolute',
    width: 100,
    height: 80,
    backgroundColor: '#fffdf8',
    borderRadius: 200,
    top: '48%',
    left: '62%',
    opacity: 0.4,
  },
  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default FloatingBlobsBackground;
