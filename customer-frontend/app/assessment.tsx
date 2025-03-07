import React, { useEffect, useState, useContext, useRef } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing, SafeAreaView, Dimensions } from 'react-native';
import { fetchData } from '@/app/api/product-img/route';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ProductContext } from '@/app/productContext';
import { useAssessmentContext } from './AssessmentContext';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView } from 'react-native';
import Gallery from './Gallery';

// Get screen dimensions
const { height } = Dimensions.get('window');

interface ReturnOption {
  id: string;
  name: string;
  price: string;
}

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
  condition: string;
  estimatedRefundValue: number;
  eligibleForResale: boolean;
  repairsNeeded: boolean;
  recommendedAction: RecommendedAction[];
  recommendedRepair: string;
  isWardrobing: boolean;
}

const AssessmentScreen: React.FC = () => {
  const { product, setProduct } = useContext(ProductContext);
  const { images } = useAssessmentContext();
  const [screenState, setScreenState] = useState('loading');
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  
  // Return options
  const returnOptions: ReturnOption[] = [
    { id: 'canada-post', name: 'Canada Post Drop-off', price: '$19.99' },
    { id: 'staples', name: 'Staples', price: 'FREE' },
    { id: 'purolator', name: 'Purolator', price: 'FREE' }
  ];

  // Use refs for animated values
  const dot1Animation = useRef(new Animated.Value(0)).current;
  const dot2Animation = useRef(new Animated.Value(0)).current;
  const dot3Animation = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssessmentData('Data loaded after 7 seconds');
      setScreenState('loaded');
    }, 7000);

    return () => clearTimeout(timer);
  }, []);
    
  // Create interpolated values for the translation
  const dot1TranslateY = dot1Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });
  
  const dot2TranslateY = dot2Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });
  
  const dot3TranslateY = dot3Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });

  const animateDots = () => {
    dot1Animation.setValue(0);
    dot2Animation.setValue(0);
    dot3Animation.setValue(0);

    Animated.sequence([
      Animated.timing(dot1Animation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(dot2Animation, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dot3Animation, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (screenState === 'loading') {
        animateDots();
      }
    });
  };
    
  useEffect(() => {
    if (screenState === 'loading') {
      animateDots();
    }
  }, [screenState]);

  const handleButtonClick = () => {
    router.push('/barcode');
  };

  const handleMenuClick = () => {
    router.push('/select-product');
  };

  if (screenState === 'loading' || !assessmentData) {
    return (
      <View style={styles.contentContainer}>
        <FloatingBlobsBackground />
        <Text style={styles.titleText}>Processing return</Text>
        <View style={styles.dotsContainer}>
          <Animated.Text 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot1TranslateY }] }
            ]}
          />
          <Animated.Text 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot2TranslateY }] }
            ]}
          />
          <Animated.Text 
            style={[
              styles.dot, 
              { transform: [{ translateY: dot3TranslateY }] }
            ]}
          />
        </View>
      </View>
    );
  }
    
  // Render checkmark or x based on condition
  const renderChecklistIcon = (condition: boolean) => {
    return condition ? (
      <Text style={styles.checkmarkText}>✓</Text>
    ) : (
      <Text style={styles.xmarkText}>✗</Text>
    );
  };

  const withinReturnWindow = () => {
    const today = new Date();
    if (product) {
      const receivedDate = new Date(product.received);
      const diffTime = Math.abs(today.getTime() - receivedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    return false;
  }

  // Determine if product is non-returnable
  const isNonReturnable = !product?.eligibleForResale || 
                          !withinReturnWindow() || 
                          product?.condition === 'Salvage';

  // Main render method - unified approach
  return (
      <View style={styles.container}>
        <FloatingBlobsBackground />
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Assessment Summary</Text>
        
        {/* Main content in ScrollView */}
        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryHeaderRow}>
                  <Text style={styles.conditionText}>Condition: {product ? product.condition : 'N/A'}</Text>
                  {product && <Text style={styles.valueText}>Estimated Refund Value: ${product.estimatedRefundValue}</Text>}
                </View>
              </View>
              
              <Gallery/>
              
              <View style={styles.checklistContainer}>
                <View style={styles.checklistItem}>
                  {product && renderChecklistIcon(!!product.eligibleForResale)}
                  <Text style={[styles.checklistItemText, product && !product.eligibleForResale && styles.ineligibleText]}>
                    Eligible to return
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  {product && renderChecklistIcon(!product.repairsNeeded)}
                  <Text style={[styles.checklistItemText, product && product.repairsNeeded && styles.ineligibleText]}>
                    No repairs/refurbishments needed
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  {renderChecklistIcon(withinReturnWindow())}
                  <Text style={[styles.checklistItemText, !withinReturnWindow() && styles.ineligibleText]}>
                    Within 30 days of purchase
                  </Text>
                </View>
                <View style={styles.checklistItem}>
                  {product && renderChecklistIcon(!product.isWardrobing)}
                  <Text style={[styles.checklistItemText, product && product.isWardrobing && styles.ineligibleText]}>
                    No wardrobing behavior detected
                  </Text>
                </View>
              </View>
              
              {/* Show non-returnable reason if applicable */}
              {isNonReturnable ? (
                <>
                  {(product?.condition === 'Salvage' || !product?.eligibleForResale) && (
                    <View style={styles.nonReturnableReasonContainer}>
                      <Text style={styles.nonReturnableTitle}>Why your product cannot be returned?</Text>
                      <Text style={styles.nonReturnableDescription}>
                        Based on the condition of the product in the provided image, this item does not meet the requirements for a return. We require item condition of at least "Used - Good" or higher.
                      </Text>
                      <Text style={styles.disclaimerText}>
                        Please contact our support customer at 1-234-5678 If you believe this is a mistake
                      </Text>
                    </View>
                  )}
                  
                  {!withinReturnWindow() && (
                    <View style={styles.nonReturnableReasonContainer}>
                      <Text style={styles.nonReturnableTitle}>Why your product cannot be returned?</Text>
                      <Text style={styles.nonReturnableDescription}>
                        We are unable to process returns for items that are outside of the 30-day return window.
                      </Text>
                      <Text style={styles.disclaimerText}>
                        Please contact our support customer at 1-234-5678 If you believe this is a mistake
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.chooseOptionText}>Choose your return option</Text>
                  <View style={styles.returnOptionsContainer}>
                    {returnOptions.map((option) => (
                      <TouchableOpacity 
                        key={option.id}
                        style={[
                          styles.returnOption,
                          selectedOption === option.id && styles.selectedReturnOption
                        ]}
                        onPress={() => setSelectedOption(option.id)}
                      >
                        <Text>{option.name}</Text>
                        <Text style={styles.optionPrice}>{option.price}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
            
            {/* Add padding at the bottom to ensure content isn't hidden behind the footer */}
            <View style={{ height: 120 }} />
          </ScrollView>
        </View>
        
        {/* Fixed footer - always visible outside of ScrollView */}
        <View style={styles.footer}>
          {isNonReturnable ? (
            <View style={styles.footerContent}>
              <Text style={styles.selectedText}>Cannot be returned</Text>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleButtonClick}
              >
                <Text style={styles.continueText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedOption && (
              <View style={styles.footerContent}>
                <Text style={styles.selectedText}>
                  {returnOptions.find(option => option.id === selectedOption)?.name}
                </Text>
                <TouchableOpacity 
                  style={styles.continueButton} 
                  onPress={handleButtonClick}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    position: 'relative', // Establish positioning context
    paddingHorizontal: 20,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 50,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
    paddingHorizontal: 50,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  summaryHeader: {
    marginBottom: 20,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  conditionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Shippori-Antique',
  },
  checklistContainer: {
    marginVertical: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkmarkText: {
    color: 'green',
    marginRight: 10,
    fontSize: 16,
  },
  xmarkText: {
    color: 'red',
    marginRight: 10,
    fontSize: 16,
  },
  checklistItemText: {
    fontSize: 14,
  },
  ineligibleText: {
    color: 'red',
  },
  chooseOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Shippori-Antique',
  },
  returnOptionsContainer: {
    marginBottom: 20,
  },
  returnOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 5,
  },
  selectedReturnOption: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#f0f0f0',
  },
  optionPrice: {
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
    zIndex: 1000, // Ensure it's above other content
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
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
  nonReturnableReasonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    padding: 20,
    marginTop: 20,
    paddingVertical: 30,
  },
  nonReturnableTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Shippori-Antique',
  },
  nonReturnableDescription: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  disclaimerText: {
    fontSize: 12,
    color: 'red',
    fontStyle: 'italic',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 30,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Shippori-Antique',
  },
});

export default AssessmentScreen;