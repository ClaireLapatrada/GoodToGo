import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import FloatingBlobsBackground from "@/app/components/background-blur";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

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
  recommendedAction: string;
  actionOptions?: Array<{
    action: string;
    value: number;
  }>;
}

export default function ScanProduct() {
  const [scannedData, setScannedData] = useState<Product | null>(null);
  const [product, setProductState] = useState<any>(null);
  const [isCameraActive, setIsCameraActive] = useState(true); // Control camera state
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Shippori-Antique": require("../assets/fonts/ShipporiAntiqueB1-Regular.ttf"),
  });

  const handleMenuClick = () => {
    router.push("/");
  };

  const handleContinue = () => {
    // Handle the continue action
    console.log("Continue with action:", selectedAction);
    // Navigate to next screen or process the selection
    router.push('/resale-processed')
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  function setProduct(productData: any) {
    setProductState(productData);
  }

  const handleBarcodeScan = ({ data }: { data: string }) => {
    try {
      const parsedData = JSON.parse(data);
      // Add mock action options if they don't exist in the scanned data
      if (!parsedData.actionOptions) {
        parsedData.actionOptions = [
          { action: "Resell to online platform", value: 140 },
          { action: "Auction to marketplace", value: 125 },
          { action: "Go to SALE section", value: 75 },
          { action: "Send to landfill", value: 0 },
        ];
      }
      setScannedData(parsedData);
      setSelectedAction(parsedData.actionOptions[0].action); // Select first option by default
      setIsCameraActive(false);
    } catch (error) {
      console.error("Error parsing scanned data:", error);
    }
  };

  useEffect(() => {
    if (scannedData) {
      console.log("Scanned data:", scannedData);
      setIsCameraActive(false); // Disable the camera after scanning
    }
  }, [scannedData]);

  // Example function for rendering checklist icons
  const renderChecklistIcon = (condition: boolean) => {
    return condition ? (
      <Text style={styles.checkmarkText}>✓</Text>
    ) : (
      <Text style={styles.xmarkText}>✗</Text>
    );
  };

  return (
    <View style={styles.container}>
      <FloatingBlobsBackground />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuClick}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>
      <Text style={styles.headerTitle}>Product Summary</Text>


      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cameraContainer}>
          {isCameraActive ? (
            <CameraView
              style={styles.squareCamera}
              facing="back"
              onBarcodeScanned={handleBarcodeScan}
            />
          ) : null}
        </View>

        {!isCameraActive && scannedData ? (
          <>
            <View style={styles.productCard}>
              <View style={styles.productHeader}>
              <View style={styles.productImageContainer}>
                <View style={styles.productImage} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{scannedData.name}</Text>
                <Text style={styles.productDetail}>Order ID: {scannedData.id}</Text>
                <Text style={styles.productDetail}>Ordered: {scannedData.ordered}</Text>
                <Text style={styles.productDetail}>Received: {scannedData.received}</Text>
              </View>
            </View>
              <View style={styles.divider} />

              <View style={styles.conditionSection}>
                <View style={styles.conditionRow}>
                  <Text style={styles.conditionLabel}>Condition:</Text>
                  <Text style={styles.conditionValue}>{scannedData.condition}</Text>
                  <TouchableOpacity style={styles.infoIcon}>
                    <Ionicons name="information-circle-outline" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
                <View style={styles.conditionRow}>
                  <Text style={styles.conditionLabel}>Estimated Resale Value:</Text>
                  <Text style={styles.conditionValue}>${scannedData.estimatedRefundValue}</Text>
                </View>
              </View>

              <View style={styles.checklistSection}>
                <View style={styles.checklistItem}>
                  {renderChecklistIcon(scannedData.eligibleForResale)}
                  <Text style={styles.checklistText}>Eligible for resale</Text>
                </View>
                <View style={styles.checklistItem}>
                  {renderChecklistIcon(!scannedData.repairsNeeded)}
                  <Text style={styles.checklistText}>No refurbishments needed</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recommended action</Text>

            <View style={styles.actionCard}>
              {scannedData.actionOptions?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionOption}
                  onPress={() => setSelectedAction(option.action)}
                >
                  <View style={styles.radioRow}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedAction === option.action && styles.radioButtonSelected,
                      ]}
                    >
                      {selectedAction === option.action && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.actionText}>{option.action}</Text>
                    <Text style={styles.actionValue}>${option.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {scannedData.repairsNeeded && (
                <>
                    <Text style={styles.sectionTitle}>Recommended repair steps</Text>
                    <View style={styles.repairCard}>
                    <Text style={styles.actionText}>{scannedData.recommendedAction}</Text>
                    </View>
                </>
                )}
          </>
        ) : (
          <Text style={styles.scanPrompt}>Scan a QR Code to Get Product Info</Text>
        )}
      </ScrollView>

      {!isCameraActive && scannedData && (
        <View style={styles.bottomBar}>
          <View style={styles.selectedActionContainer}>
            <Text style={styles.selectedActionText}>
              {selectedAction || "Select an action"}
            </Text>
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f1e9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Shippori-Antique",
    paddingHorizontal: 50,
  },
  menuIcon: {
    padding: 0,
  },
  adminBadge: {
    padding: 0,
  },
  adminText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 50,
    paddingBottom: 20,
  },
  squareCamera: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  cameraContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  scanPrompt: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Shippori-Antique",
  },
  productCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: "row",
  },
  productImageContainer: {
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: "#B4A7D6", // Purple color from the image
    borderRadius: 10,
  },
  productInfo: {
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    fontFamily: "Shippori-Antique",
  },
  productDetail: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Shippori-Antique",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  conditionSection: {
    marginBottom: 15,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  conditionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
    fontFamily: "Shippori-Antique",
  },
  conditionValue: {
    fontSize: 16,
    flex: 1,
  },
  infoIcon: {
    padding: 2,
  },
  checklistSection: {
    marginTop: 5,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4CAF50", // Green
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  xmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F44336", // Red
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checklistText: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "Shippori-Antique",
  },
  actionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20, // Extra space for bottom bar
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  repairCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 100, // Extra space for bottom bar
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionOption: {
    marginVertical: 3,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: "#000",
  },
  radioButtonInner: {
    width: 9,
    height: 9,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  actionText: {
    fontSize: 15,
    flex: 1,
  },
  actionValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  selectedActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedActionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 25,
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
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
});