import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, KeyboardTypeOptions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import FloatingBlobsBackground from './components/background-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { TextInput as Input } from 'react-native-paper';


// Custom implementations of imported components
const Card: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CardContent: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

export default function PaymentBillingPage() {
    const [isAgreed, setIsAgreed] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [termsModalVisible, setTermsModalVisible] = useState(false);

    const router = useRouter();
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
            'Shippori-Antique': require('../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
        });
    const handleMenuClick = () => {
        // Navigation logic would go here
        router.push('/select-product');
    };

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleRefund = () => {
        // Implement refund logic here
        console.log('Refund processing with details:', {
            cardNumber,
            cardHolderName,
            expiryDate,
            cvv,
            address,
            city,
            postalCode,
            country
        });
        router.push('/refund-status');
    };

    const handleCheckboxClick = () => {
        if (!isAgreed) {
            setTermsModalVisible(true);
        } else {
            setIsAgreed(false);
        }
    };

    const handleAcceptTerms = () => {
        setIsAgreed(true);
        setTermsModalVisible(false);
    };

    const handleCloseTerms = () => {
        setTermsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <FloatingBlobsBackground />
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <MaterialIcons name="menu" size={24} color="black" onPress={handleMenuClick}/>
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Payment & Billing Info</Text>
            </View>
            <Card>
                <CardContent>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Card Number</Text>
                        <Input 
                            placeholder="Enter card number"
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            keyboardType="numeric"
                            style={[styles.input, styles.textInput]}
                            theme={{ colors: { background: '#f5f5f5' } }}
                            dense={true}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Card Holder Name</Text>
                        <Input 
                            placeholder="Name on card"
                            value={cardHolderName}
                            onChangeText={setCardHolderName}
                            style={[styles.input, styles.textInput]}
                            theme={{ colors: { background: '#f5f5f5' } }}
                            dense={true}
                        />
                    </View>

                    <View style={styles.horizontalInputGroup}>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.label}>Expiry Date</Text>
                            <Input 
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                                keyboardType="numeric"
                                style={[styles.input, styles.textInput]}
                                theme={{ colors: { background: '#f5f5f5' } }}
                                dense={true}
                            />
                        </View>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.label}>CVV</Text>
                            <Input 
                                placeholder="CVV"
                                secureTextEntry
                                value={cvv}
                                onChangeText={setCvv}
                                keyboardType="numeric"
                                style={[styles.input, styles.textInput]}
                                theme={{ colors: { background: '#f5f5f5' } }}
                                dense={true}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <Input 
                            placeholder="Street address"
                            value={address}
                            onChangeText={setAddress}
                            style={[styles.input, styles.textInput]}
                            theme={{ colors: { background: '#f5f5f5' } }}
                            dense={true}
                        />
                    </View>

                    <View style={styles.horizontalInputGroup}>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.label}>City</Text>
                            <Input 
                                placeholder="City"
                                value={city}
                                onChangeText={setCity}
                                style={[styles.input, styles.textInput]}
                                theme={{ colors: { background: '#f5f5f5' } }}
                                dense={true}
                            />
                        </View>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.label}>Postal Code</Text>
                            <Input 
                                placeholder="Postal Code"
                                value={postalCode}
                                onChangeText={setPostalCode}
                                style={[styles.input, styles.textInput]}
                                theme={{ colors: { background: '#f5f5f5' } }}
                                dense={true}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Country</Text>
                        <Input 
                            placeholder="Select country"
                            value={country}
                            onChangeText={setCountry}
                            style={[styles.input, styles.textInput]}
                            theme={{ colors: { background: '#f5f5f5' } }}
                            dense={true}
                        />
                    </View>

                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity 
                            onPress={handleCheckboxClick}
                            style={[
                                styles.checkbox, 
                                isAgreed && styles.checkboxChecked
                            ]}
                        >
                            {isAgreed && <Text style={styles.checkboxCheckmark}>✓</Text>}
                        </TouchableOpacity>
                        <Text style={styles.checkboxLabel}>
                            I agree to the <Text style={styles.termsLink} onPress={() => setTermsModalVisible(true)}>terms and conditions</Text> and certify all the provided information is accurate
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.refundButton, 
                            !isAgreed && styles.disabledButton
                        ]} 
                        onPress={handleRefund} 
                        disabled={!isAgreed}
                    >
                        <Text style={styles.refundButtonText}>Refund</Text>
                    </TouchableOpacity>
                </CardContent>
            </Card>

            {/* Terms and Conditions Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={termsModalVisible}
                onRequestClose={handleCloseTerms}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Terms and Conditions</Text>
                            <TouchableOpacity onPress={handleCloseTerms}>
                                <MaterialIcons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.termsScrollView}>
                            <Text style={styles.termsSectionTitle}>1. Eligibility for Returns</Text>
                            <Text style={styles.termsText}>
                                We accept returns under the following conditions:
                            </Text>
                            <View style={styles.bulletList}>
                                <Text style={styles.termsText}>• The item must be returned within <Text style={styles.boldText}>[X days]</Text> of the delivery date.</Text>
                                <Text style={styles.termsText}>• The item must be <Text style={styles.boldText}>unused, in its original packaging, and in the same condition</Text> as received.</Text>
                                <Text style={styles.termsText}>• Proof of purchase (receipt or order confirmation) is required.</Text>
                            </View>

                            <Text style={styles.termsSectionTitle}>2. Non-Returnable Items</Text>
                            <Text style={styles.termsText}>
                                Certain items are not eligible for return, including:
                            </Text>
                            <View style={styles.bulletList}>
                                <Text style={styles.termsText}>• Items marked as <Text style={styles.boldText}>final sale</Text> or <Text style={styles.boldText}>non-refundable</Text></Text>
                                <Text style={styles.termsText}>• Customized or personalized products</Text>
                                <Text style={styles.termsText}>• Items damaged due to improper use or negligence</Text>
                            </View>

                            <Text style={styles.termsSectionTitle}>3. Return Process</Text>
                            <Text style={styles.termsText}>
                                To initiate a return:
                            </Text>
                            <View style={styles.numberedList}>
                                <Text style={styles.termsText}>1. Contact our customer support at <Text style={styles.boldText}>[email/contact info]</Text> with your order details.</Text>
                                <Text style={styles.termsText}>2. We will provide you with a return authorization and shipping instructions.</Text>
                                <Text style={styles.termsText}>3. Ship the item back to us using a <Text style={styles.boldText}>trackable shipping method</Text> (return shipping costs are the responsibility of the customer unless the item is defective or incorrect).</Text>
                                <Text style={styles.termsText}>4. Once received and inspected, we will process your refund or exchange within <Text style={styles.boldText}>[X days]</Text>.</Text>
                            </View>

                            <Text style={styles.termsSectionTitle}>4. Refunds</Text>
                            <View style={styles.bulletList}>
                                <Text style={styles.termsText}>• Refunds will be processed to the <Text style={styles.boldText}>original payment method</Text> within <Text style={styles.boldText}>[X days]</Text> of approval.</Text>
                                <Text style={styles.termsText}>• Shipping costs are <Text style={styles.boldText}>non-refundable</Text>, unless the return is due to our error.</Text>
                            </View>

                            <Text style={styles.termsSectionTitle}>5. Exchanges</Text>
                            <Text style={styles.termsText}>
                                If you received a <Text style={styles.boldText}>defective or incorrect item</Text>, we will offer an exchange at no additional cost. Please contact us within <Text style={styles.boldText}>[X days]</Text> of receiving your order.
                            </Text>

                            <Text style={styles.termsSectionTitle}>6. Late or Missing Refunds</Text>
                            <Text style={styles.termsText}>
                                If you haven't received a refund after <Text style={styles.boldText}>[X days]</Text>, please:
                            </Text>
                            <View style={styles.bulletList}>
                                <Text style={styles.termsText}>• Check your bank or credit card statement.</Text>
                                <Text style={styles.termsText}>• Contact your payment provider, as processing times may vary.</Text>
                                <Text style={styles.termsText}>• If you still have issues, reach out to us at <Text style={styles.boldText}>[email/contact info]</Text>.</Text>
                            </View>

                            <Text style={styles.termsSectionTitle}>7. Contact Us</Text>
                            <Text style={styles.termsText}>
                                For any return inquiries, please email us at <Text style={styles.boldText}>[email]</Text> or call <Text style={styles.boldText}>[phone number]</Text>.
                            </Text>
                        </ScrollView>
                        
                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={styles.declineButton} 
                                onPress={handleCloseTerms}
                            >
                                <Text style={styles.declineButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.acceptButton} 
                                onPress={handleAcceptTerms}
                            >
                                <Text style={styles.acceptButtonText}>Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'flex-start',
        paddingVertical: 70,
        paddingHorizontal: 50,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardContent: {
        padding: 20
    },
    inputGroup: {
        marginBottom: 15
    },
    label: {
        marginBottom: 5,
        color: '#666',
        fontSize: 14
    },
    input: {
        height: 40,
        backgroundColor: '#f5f5f5'
    },
    textInput: {
        fontSize: 12,
      },
    horizontalInputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    halfInputGroup: {
        width: '48%'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxChecked: {
        backgroundColor: '#007AFF'
    },
    checkboxCheckmark: {
        color: 'white', 
        fontSize: 12
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 12,
        color: '#666'
    },
    termsLink: {
        color: '#007AFF',
        textDecorationLine: 'underline'
    },
    refundButton: {
        backgroundColor: 'black',
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
        opacity: 1
    },
    disabledButton: {
        backgroundColor: '#999',
        opacity: 0.7
    },
    refundButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    topBar: {
        justifyContent: 'flex-start',
        marginBottom: 25,
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 20,
        fontFamily: 'Shippori-Antique',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Shippori-Antique',
    },
    termsScrollView: {
        padding: 20,
        maxHeight: 400
    },
    termsSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16
    },
    termsText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
        marginBottom: 8
    },
    boldText: {
        fontWeight: 'bold'
    },
    bulletList: {
        marginLeft: 10,
        marginBottom: 16
    },
    numberedList: {
        marginLeft: 10,
        marginBottom: 16
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0'
    },
    acceptButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginLeft: 10,
        width: 100
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },
    declineButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: 100
    },
    declineButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    }
});