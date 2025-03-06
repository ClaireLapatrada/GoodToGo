import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingBlobsBackground from './components/background-blur';

const ResaleProcessingScreen = () => {
  const [screenState, setScreenState] = useState('loading'); // 'loading' or 'completed'
  const navigation = useNavigation();
  const router = useRouter();
  
  // Create animated values for each dot
  const dot1Animation = useRef(new Animated.Value(0)).current;
  const dot2Animation = useRef(new Animated.Value(0)).current;
  const dot3Animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  // Handle home button click
  const handleHomePress = () => {
    router.push('/');
  };
  
  // Simple timeout without complex animations
  useEffect(() => {
    console.log("Setting timeout for 2000ms");
    const timer = setTimeout(() => {
      console.log("Timeout completed, changing state to completed");
      setScreenState('completed');
    }, 2000);
    
    return () => {
      console.log("Clearing timeout");
      clearTimeout(timer);
    };
  }, []);
  
  // Animate the dots with sequenced timing
  useEffect(() => {
    const animateDots = () => {
      // Reset values
      dot1Animation.setValue(0);
      dot2Animation.setValue(0);
      dot3Animation.setValue(0);
      
      // Create sequence of animations with staggered timing
      Animated.sequence([
        // First dot animation
        Animated.timing(dot1Animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Second dot animation starts slightly after first
        Animated.timing(dot2Animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Third dot animation starts slightly after second
        Animated.timing(dot3Animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Once complete, restart the animation if still in loading state
        if (screenState === 'loading') {
          animateDots();
        }
      });
    };

    if (screenState === 'loading') {
      animateDots();
    }
    
    return () => {
      // No cleanup needed as animations will stop when component unmounts
    };
  }, [dot1Animation, dot2Animation, dot3Animation, screenState]);
  
  // Create interpolated values for the translation
  const dot1TranslateY = dot1Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0], // Move up 10 pixels then back down
  });
  
  const dot2TranslateY = dot2Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });
  
  const dot3TranslateY = dot3Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });
  
  return (
    <View style={styles.pageContainer}>
      <View style={styles.backgroundGradient} />
      <FloatingBlobsBackground />

      {/* Menu and Admin text */}
      <View style={styles.menuButton}>
        <TouchableOpacity onPress={() => router.push('/')}>
            <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.adminText}>Admin</Text>
      
      {screenState === 'loading' ? (
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Processing resale</Text>
          <View style={styles.dotsContainer}>
            <Animated.Text 
              style={[
                styles.dot, 
                { transform: [{ translateY: dot1TranslateY }] }
              ]}
            >
              •
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.dot, 
                { transform: [{ translateY: dot2TranslateY }] }
              ]}
            >
              •
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.dot, 
                { transform: [{ translateY: dot3TranslateY }] }
              ]}
            >
              •
            </Animated.Text>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.successContainer}>
            <Text style={styles.titleText}>Resale processed</Text>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          
          <Text style={styles.messageText}>
            Please check your chosen platform for the product status
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={handleHomePress}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F2EFE6',
    opacity: 0.8,
  },
  menuButton: {
    position: 'absolute',
    top: 70,
    left: 50,
  },
  menuIcon: {
    fontSize: 24,
    color: 'black',
  },
  adminText: {
    position: 'absolute',
    top: 70,
    right: 50,
    fontSize: 14,
    color: 'black',
    fontFamily: 'Shippori-Antique',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '500',
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Shippori-Antique',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 30, // Fixed height to prevent layout shifts during animation
    alignItems: 'center',
  },
  dot: {
    fontSize: 24,
    color: 'black',
    marginHorizontal: 4,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkmark: {
    fontSize: 24,
    color: 'black',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    maxWidth: 250,
    marginBottom: 30,
    marginTop: 10,
    fontFamily: 'Shippori-Antique',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ResaleProcessingScreen;