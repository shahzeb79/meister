import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function GlobalBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["rgba(190, 75, 37, 0.3)", "rgba(170, 27, 117, 0.8)", "rgba(70, 52, 95, 1)"]}
        locations={[0.15, 0.55, 0.98]}
        style={styles.gradient}
      />

      {/* Starry Effect */}
      <View style={styles.starryContainer}>
        <View style={styles.star1} />
        <View style={styles.star2} />
        <View style={styles.star3} />
        <View style={styles.star4} />
        <View style={styles.star5} />
        <View style={styles.star6} />
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    width: width * 2,
    height: height,
    top: -width * 0.6,
    left: -width * 0.14,
    borderRadius: width,
    transform: [{ rotate: "15.25deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 12 }, // Adjust the shadow's position
    shadowRadius: 10, // Shadow blur radius
    // For Android
  },
  starryContainer: {
    position: "absolute",
    top: 50, // Adjust to position the stars
    left: 50, // Adjust to position the stars
  },
  star1: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 2,
    top: 60,
    left: 230,
  },
  star2: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 3,
    top: 70,
    left: 250,
  },
  star3: {
    position: "absolute",
    width: 3,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 1.5,
    top: 90,
    left: 230,
  },
  star4: {
    position: "absolute",
    width: 5,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 2.5,
    top: 80,
    left: 280,
  },
  star5: {
    position: "absolute",
    width: 7,
    height: 7,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 3.5,
    top: 60,
    left: 300,
  },
  star6: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 3.5,
    top: 50,
    left: 280,
  },
});
