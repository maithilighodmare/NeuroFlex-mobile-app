import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Track Recovery Progress",
    desc: "Monitor your healing journey with real-time insights and progress tracking.",
    image: require("../../../assets/onboard1.png"),
    bg: "#C0F0ED",
  },
  {
    id: 2,
    title: "Smart Physiotherapy Exercises",
    desc: "Perform exercises with guided feedback and sensor-based accuracy.",
    image: require("../../../assets/onboard2.png"),
    bg: "#C8E8E7",
  },
  {
    id: 3,
    title: "Personalized Dashboard",
    desc: "Access tailored insights for doctors and patients in one simple view.",
    image: require("../../../assets/onboard3.png"),
    bg: "#BCE3E0",
  },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[index];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: current.bg }]}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={current.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.desc}>{current.desc}</Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={prevSlide}>
          <Ionicons name="arrow-back-circle" size={40} color="#007B83" />
        </TouchableOpacity>

        {index === slides.length - 1 ? (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={nextSlide}>
            <Ionicons name="arrow-forward-circle" size={40} color="#007B83" />
          </TouchableOpacity>
        )}
      </View>

      {/* Dots Indicator */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 25,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#007B83",
    fontWeight: "600",
  },
  imageContainer: {
    flex: 0.55,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textContainer: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#004F55",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    color: "#005A60",
    textAlign: "center",
    lineHeight: 22,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    marginTop: 15,
  },
  startBtn: {
    backgroundColor: "#007B83",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#9FD4D1",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007B83",
    width: 12,
    height: 12,
  },
});
