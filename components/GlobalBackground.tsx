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
  }
});