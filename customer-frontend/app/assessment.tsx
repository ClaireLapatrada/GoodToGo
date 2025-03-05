import React, { useEffect, useState, useContext } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing } from 'react-native';
import { fetchData } from '@/app/api/product-img/route';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ProductContext } from '@/app/productContext';

interface ReturnOption {
  id: string;
  name: string;
  price: string;
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
  }
  
  interface SelectProductProps {
    product: Product | null;
    setProduct: (product: Product) => void;
  }

const AssessmentScreen: React.FC = () => {
  const { product, setProduct } = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const textTranslateY = new Animated.Value(0);
  const buttonOpacity = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(0);
  const router = useRouter();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
  });

  // Return options
  const returnOptions: ReturnOption[] = [
    { id: 'canada-post', name: 'Canada Post Drop-off', price: '$19.99' },
    { id: 'staples', name: 'Staples', price: 'FREE' },
    { id: 'purolator', name: 'Purolator', price: 'FREE' }
  ];
  
  // Disable the header for this screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Fetch data from the backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        setAssessmentData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

    useEffect(() => {
      console.log('Product in Assessment:', product);
    }, [product]);
    
  
  // Dot loading animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    Animated.parallel([
      Animated.timing(textTranslateY, {
        toValue: -100,
        duration: 1500,
        useNativeDriver: true
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(buttonTranslateY, {
        toValue: -230,
        duration: 1500,
        useNativeDriver: true
      })
    ]).start();

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

const handleButtonClick = () => {
    if (product) {
      const productToSet = {
        name: product.name,
        id: product.id,
        price: product.price,
        ordered: product.ordered,
        received: product.received,
        condition: assessmentData.condition,
        estimatedRefundValue: assessmentData.estimatedRefundValue,
        eligibleForResale: assessmentData.isEligibleToReturn,
        repairsNeeded: !assessmentData.noRepairsNeeded,
        recommendedAction: 'HELLO'
      };
      setProduct(productToSet);
      // Use navigation method that matches your _layout.tsx
      router.push('/barcode');
    }
  };

  const handleMenuClick = () => {
    // Use router.push to navigate to the details page
    router.push('/select-product');
  };

  // Render checkmark or x based on condition
  const renderChecklistIcon = (condition: boolean) => {
    return condition ? (
      <Text style={styles.checkmarkText}>✓</Text>
    ) : (
      <Text style={styles.xmarkText}>✗</Text>
    );
  };

  // Loading screen with animated dots
  if (isLoading || !assessmentData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Assessing product's condition...</Text>
        <View style={styles.dotContainer}>
          {[0.3, 0.3, 0.3, 0.3].map((_, index) => (
            <View 
              key={index} 
              style={styles.dot}
            />
          ))}
        </View>
      </View>
    );
  }

  // Render non-returnable product view
  const renderNonReturnableView = () => {
    return (
      <View style={styles.container}>
        <FloatingBlobsBackground />
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Assessment Summary</Text>

        <View style={styles.card}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryHeaderRow}>
              <Text style={styles.conditionText}>Condition: {assessmentData.condition}</Text>
              <Text style={styles.valueText}>Estimated Refund Value: ${assessmentData.estimatedRefundValue}</Text>
            </View>
          </View>
          
          <View style={styles.checklistContainer}>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.isEligibleToReturn)}
              <Text style={[styles.checklistItemText, !assessmentData.isEligibleToReturn && styles.ineligibleText]}>
                Eligible to return
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.noRepairsNeeded)}
              <Text style={[styles.checklistItemText, !assessmentData.noRepairsNeeded && styles.ineligibleText]}>
                No repairs/refurbishments needed
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.withinReturnWindow)}
              <Text style={[styles.checklistItemText, !assessmentData.withinReturnWindow && styles.ineligibleText]}>
                Within 30 days of purchase
              </Text>
            </View>
          </View>
          
          <View style={styles.nonReturnableReasonContainer}>
            <Text style={styles.nonReturnableTitle}>Why your product cannot be returned?</Text>
            <Text style={styles.nonReturnableDescription}>
            Based on the condition of the product in the provided image, this item does not meet the requirements for a return. We require item condition of at least “Used - Good" or higher.
            </Text>
            <Text style={styles.disclaimerText}>
              Please contact our support customer at 1-234-5678 If you believe this is a mistake
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Assessment summary with return options
  const renderReturnOptionsView = () => {
    return (
      <View style={styles.container}>
        <FloatingBlobsBackground />
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Assessment Summary</Text>

        <View style={styles.card}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryHeaderRow}>
              <Text style={styles.conditionText}>Condition: {assessmentData.condition}</Text>
              <Text style={styles.valueText}>Estimated Refund Value: ${assessmentData.estimatedRefundValue}</Text>
            </View>
          </View>
          
          <View style={styles.checklistContainer}>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.isEligibleToReturn)}
              <Text style={[styles.checklistItemText, !assessmentData.isEligibleToReturn && styles.ineligibleText]}>
                Eligible to return
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.noRepairsNeeded)}
              <Text style={[styles.checklistItemText, !assessmentData.noRepairsNeeded && styles.ineligibleText]}>
                No repairs/refurbishments needed
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {renderChecklistIcon(assessmentData.withinReturnWindow)}
              <Text style={[styles.checklistItemText, !assessmentData.withinReturnWindow && styles.ineligibleText]}>
                Within 30 days of purchase
              </Text>
            </View>
          </View>
          
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
        </View>
        {/* Bottom Fixed Selection Tab */}
        {selectedOption && (
          <View style={styles.selectedContainer}>
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
        )}
      </View>
    );
  };

  // Decide which view to render based on condition and eligibility
  return (assessmentData.condition === 'Salvage' || !assessmentData.isEligibleToReturn) 
    ? renderNonReturnableView() 
    : renderReturnOptionsView();
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0'
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20
  },
  header: {
    paddingTop: 70,
    paddingBottom: 10,
    paddingHorizontal: 50,
  },
  dotContainer: {
    flexDirection: 'row'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 50
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    fontFamily: 'Shippori-Antique',
    paddingHorizontal: 50
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
    marginBottom: 20
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  checkmarkText: {
    color: 'green',
    marginRight: 10,
    fontSize: 16
  },
  xmarkText: {
    color: 'red',
    marginRight: 10,
    fontSize: 16
  },
  checklistItemText: {
    fontSize: 14
  },
  ineligibleText: {
    color: 'red'
  },
  chooseOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Shippori-Antique',
  },
  returnOptionsContainer: {
    marginBottom: 20
  },
  returnOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 5
  },
  selectedReturnOption: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#f0f0f0'
  },
  optionPrice: {
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
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
    color: 'black', // Dark red color
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
});

export default AssessmentScreen;
