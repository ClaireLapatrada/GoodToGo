import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useAssessmentContext } from "./AssessmentContext";

const Gallery: React.FC = () => {
  const { images } = useAssessmentContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (images.length === 0) {
    return <Text style={styles.noImagesText}>No images uploaded.</Text>;
  }

  const imageUrl = `data:image/png;base64,${images[currentIndex]}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={prevImage} style={styles.navButton}>
        <Text style={styles.navText}>❮</Text>
      </TouchableOpacity>

      <Image src={imageUrl} style={styles.image} />

      <TouchableOpacity onPress={nextImage} style={styles.navButton}>
        <Text style={styles.navText}>❯</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 24,
    color: "black",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    resizeMode: "contain",
  },
  noImagesText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default Gallery;
