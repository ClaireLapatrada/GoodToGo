import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { ProductContext } from '@/app/productContext';
import FloatingBlobsBackground from './components/background-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


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
  }

const QRCodeScreen: React.FC = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const { product, setProduct } = useContext(ProductContext);
    const [fontsLoaded] = useFonts({
        'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    });
    
    // New state for QR code modal
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);

    const handleMenuClick = () => {
        router.push('/select-product');
    };

    const toggleQRCodeModal = () => {
        setIsQRCodeModalVisible(!isQRCodeModalVisible);
    };

    const handleButtonClick = () => {
        router.push('/payment-billing');
      };

    useEffect(() => {
        console.log('Product in Barcode:', product);
    }, [product]);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <FloatingBlobsBackground />
            <TouchableOpacity>
                <MaterialIcons name="file-download" size={24} color="black" style={styles.downloadIcon} />
            </TouchableOpacity>
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Print your generated tags</Text>
            </View>

            <View style={styles.shippingLabel}>
                <Text style={styles.labelTitle}>FROM</Text>
                <View style={styles.addressLines}>
                    <View style={styles.lineSpace}></View>
                    <View style={styles.lineSpace}></View>
                    <View style={styles.lineSpace}></View>
                    <View style={styles.lineSpace}></View>
                </View>
                <View style={styles.postageLabel}>
                    <Text style={styles.postageLabelText}>Postage{'\n'}Required</Text>
                    <Text style={styles.cpText}>CP</Text>
                </View>
                <View style={styles.barcodeContainer}>
                    <View style={styles.addressTextContainer}>
                        <Text>ABC Store - Returns Department{'\n'}1 Apple St{'\n'}Toronto, ON M5S 1C6</Text>
                    </View>
                    <TouchableOpacity onPress={toggleQRCodeModal}>
                        <QRCode 
                            value={JSON.stringify(product)} 
                            size={60}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.slipTitle}>Return Authorization Slip</Text>
            <View style={styles.returnSlip}>
                {product && (
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCondition}>Product ID: {product.id}</Text>
                    <Text style={styles.productValue}>Value Refund: ${product.price.toFixed(2)}</Text>
                    <Text style={styles.returnReason}>Reason: I don't like {':('}</Text>
                </View>
                )}
                
                <View style={styles.barcodeContainer}>
                    <TouchableOpacity onPress={toggleQRCodeModal}>
                        <QRCode 
                            value={JSON.stringify(product)} 
                            size={60}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueButtonText} onPress={handleButtonClick}>Continue</Text>
            </TouchableOpacity>

            {/* Expanded QR Code Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isQRCodeModalVisible}
                onRequestClose={toggleQRCodeModal}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPressOut={toggleQRCodeModal}
                >
                    <View style={styles.modalContainer}>
                        <QRCode 
                            value={JSON.stringify(product)} 
                            size={300}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 50,
        paddingTop: 70,
    },
    topBar: {
        justifyContent: 'flex-start',
        marginBottom: 25,
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Shippori-Antique',
        paddingTop: 20,
    },
    downloadIcon: {
        position: 'absolute',
        right: 0,
        top: 50,
    },
    downloadIcon2: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    shippingLabel: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        position: 'relative',
    },
    labelTitle: {
        position: 'absolute',
        top: 30,
        left: 20,
        fontWeight: 'bold',
    },
    addressLines: {
        marginTop: 60,
    },
    addressTextContainer: {
        flex: 1,
        marginRight: 10,  // Adds some space between the address and the QR code
    },    
    lineSpace: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginVertical: 10,
    },
    postageLabel: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        alignItems: 'center',
    },
    postageLabelText: {
        fontSize: 10,
        textAlign: 'center',
    },
    cpText: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    barcodeContainer: {
        marginTop: 20,
        flexDirection: 'row', // This arranges the content in a row
        alignItems: 'center', // Aligns items vertically at the center
        flexWrap: 'wrap',    
    },
    returnSlip: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    slipTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Shippori-Antique',
    },
    productDetails: {
        marginBottom: 10,
    },
    productDetailsContainer: {
        flexDirection: 'row', // Align product details and barcode side by side
        alignItems: 'center',  // Vertically align both items
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Shippori-Antique',
    },
    productCondition: {
        color: '#666',
    },
    productValue: {
        color: '#666',
    },
    returnReason: {
        color: '#666',
    },
    continueButton: {
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        position: 'absolute',
        right: 50,
        bottom: 50,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default QRCodeScreen;
