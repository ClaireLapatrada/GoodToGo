import React, { useEffect, useState, useRef, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, ScrollView } from 'react-native';
import { CameraMode, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { fetchData } from '@/app/api/product-img/route';
import { AntDesign, Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import FloatingBlobsBackground from '@/app/components/background-blur';
import { ProductContext } from '@/app/productContext';

// Define the structure for our photos
interface PhotoItem {
    label: string;
    uri: string | null;
    status: 'red' | 'yellow' | 'green';
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

const ShowProduct: React.FC = () => {
  const { product, setProduct } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [returnReason, setReturnReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Create the checklist of photos to take
  const [photosList, setPhotosList] = useState<PhotoItem[]>([
    { label: 'Top Angle', uri: null, status: 'yellow' },
    { label: 'Side Angle 1', uri: null, status: 'red' },
    { label: 'Side Angle 2', uri: null, status: 'red' },
    { label: 'Bottom', uri: null, status: 'red' },
    { label: 'Brand', uri: null, status: 'red' },
  ]);
  
  const navigation = useNavigation();
  const router = useRouter();
  const ref = useRef<CameraView>(null);
  const [fontsLoaded] = useFonts({
    'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    console.log('Product in ShowProduct:', product);
  }, [product]);

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

  const handleMenuClick = () => {
    // Handle menu click
    router.push('/select-product');
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      setCurrentUri(photo.uri);
    }
  };

  const useCurrentPicture = () => {
    if (currentUri) {
      // Update the photosList with the current photo
      const updatedPhotosList = [...photosList];
      
      // Mark current photo as 'green' (completed)
      updatedPhotosList[currentPhotoIndex] = {
        ...updatedPhotosList[currentPhotoIndex],
        uri: currentUri,
        status: 'green',
      };
      
      // If not the last photo, mark the next one as 'yellow'
      if (currentPhotoIndex < photosList.length - 1) {
        updatedPhotosList[currentPhotoIndex + 1] = {
          ...updatedPhotosList[currentPhotoIndex + 1],
          status: 'yellow', // Set the next photo status to yellow
        };
      }
      
      setPhotosList(updatedPhotosList);
  
      // Move to the next photo if available
      if (currentPhotoIndex < photosList.length - 1) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
      }
  
      // Reset the current URI to return to camera view
      setCurrentUri(null);
    }
  };

  const handleSubmit = async () => {
    try {
      // Navigate with query parameters
      router.push('/assessment');
  
      const formData = new FormData();
  
      // Add photos to form data
      photosList.forEach((photo, index) => {
        if (photo.uri) {
          const fileName = `photo_${index + 1}.jpg`;
          formData.append('photos', {
            uri: photo.uri,
            name: fileName,
            type: 'image/jpeg',
          } as unknown as Blob);
        }
      });
      // Add reason to form data
      formData.append('reason', returnReason);
      formData.append('price', product?.price.toString() || '');
      // Send request without manually setting Content-Type
      const response = await fetch('http://192.168.68.70:5000/api/data', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data sent successfully:', data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  
  
  const goNext = () => {
    router.push({
      pathname: '/assessment',
      params: { product: JSON.stringify(product) },
    });
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderChecklistBoxes = () => {
    return (
      <View style={styles.checklistBoxContainer}>
        {photosList.map((photo, index) => {
          const photoStatus = photo.status;
          return (
            <View key={index} style={styles.checklistRow}>
              <View style={styles.checklistBoxItem}>
                <Text style={styles.checklistLabel}>{photo.label}</Text>
                <View
                  style={[
                    styles.checkBox,
                    photoStatus === 'green' && styles.checkBoxCompleted,
                    photoStatus === 'yellow' && styles.checkBoxInProgress,
                  ]}
                >
                  {photoStatus === 'green' && <MaterialIcons name="check" size={16} color="white" />}
                </View>
              </View>
              {/* Add empty placeholder if it's the last item */}
              {index % 2 === 0 && (
                <View style={styles.checklistBoxItem}>
                  {/* Empty placeholder to maintain grid layout */}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };
  

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.squareCamera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        >
          {!photosList.every((photo) => photo.status === 'green') && 
          <View style={styles.shutterContainer}>
            <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
              <View style={styles.shutterBtnInner} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cameraControlBtn} onPress={toggleFacing}>
              <FontAwesome6 name="rotate" size={22} color="white" />
            </TouchableOpacity>
          </View>}
        </CameraView>
      </View>
    );
  };
  const resetPhotosList = () => {
    setPhotosList([
      { label: 'Top Angle', uri: null, status: 'yellow' },
      { label: 'Side Angle 1', uri: null, status: 'red' },
      { label: 'Side Angle 2', uri: null, status: 'red' },
      { label: 'Bottom', uri: null, status: 'red' },
      { label: 'Brand', uri: null, status: 'red' },
    ]);
    setCurrentPhotoIndex(0);
    setCurrentUri(null);
  };

  const renderPicture = () => {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: currentUri }}
          contentFit="cover"
          style={styles.previewImage}
        />
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.retakeBtn} onPress={() => setCurrentUri(null)}>
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.usePhotoBtn} onPress={useCurrentPicture}>
            <Text style={styles.usePhotoBtnText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
  <View style={styles.container}>
    <FloatingBlobsBackground />
    <View style={styles.header}>
      <TouchableOpacity>
        <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
      </TouchableOpacity>
    </View>

    <Text style={styles.title}>Show us what's wrong with the product</Text>
    <TouchableOpacity onPress={resetPhotosList} style={styles.resetButton}>
        <MaterialIcons name="refresh" size={24} color="black" />
    </TouchableOpacity>
    {currentUri ? renderPicture() : renderCamera()}

    {renderChecklistBoxes()}

    <View style={styles.selectedContainer}>
      <Text style={styles.selectedText}>{selectedProduct}</Text>

      {/* Continue Button - only show when all photos are taken */}
      {photosList.every((photo) => photo.status === 'green') && (
      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>)}
      {/* <TouchableOpacity style={styles.continueButton} onPress={goNext}>
        <Text style={styles.continueText}>gogogo</Text>
      </TouchableOpacity> */}
    </View>
  </View>
  );

    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1e9',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 10,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 20,
    fontFamily: 'Shippori-Antique',
    paddingHorizontal: 50,
  },
  cameraContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 50,

  },
  squareCamera: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  cameraControlBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewImage: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 5,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
  },
  retakeBtnText: {
    color: 'black',
    fontWeight: '500',
  },
  usePhotoBtn: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
  },
  usePhotoBtnText: {
    color: 'white',
    fontWeight: '500',
  },
  checklistBoxContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 50,

  },
  checklistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '48%', // Adjust width to allow wrapping
    marginBottom: 10,
  },
  checklistBoxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Ensure the items inside the box take full width
  },
  checklistLabel: {
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Shippori-Antique',
  },
  checkBox: {
    width: 10,
    height: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  checkBoxCompleted: {
    backgroundColor: '#2ef986',
  },
  checkBoxInProgress: {
    backgroundColor: '#e7b434',
  },
  returnReasonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  returnReasonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Shippori-Antique',
  },
  returnReasonInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Shippori-Antique',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  selectedContainer: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 50,
  },
  selectedText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Shippori-Antique',
  },
  continueButton: {
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
  },
  resetButton: {
    position: 'absolute',
    top: 157,
    right: 195,
    marginBottom: 10,
  },
});

export default ShowProduct;