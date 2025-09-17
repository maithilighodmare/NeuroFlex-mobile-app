import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const slides = [
  { id: 1, text: "Track your recovery progress in real-time" },
  { id: 2, text: "Smart physiotherapy exercises made simple" },
  { id: 3, text: "Personalized dashboard for doctors & patients" },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slide content */}
      <View style={styles.slide}>
        <Text style={styles.text}>{slides[index].text}</Text>
      </View>

      {/* Navigation Arrows */}
      <View style={styles.arrows}>
        <TouchableOpacity onPress={prevSlide}>
          <Ionicons name="arrow-back-circle" size={40} color="#007B83" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextSlide}>
          <Ionicons name="arrow-forward-circle" size={40} color="#007B83" />
        </TouchableOpacity>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>

      {/* Continue button on last slide */}
      {index === slides.length - 1 && (
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.startText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  skipBtn: { position: "absolute", top: 50, right: 20 },
  skipText: { fontSize: 16, color: "#007BFF" },
  slide: {
    width: width * 0.8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#007B83",
    textAlign: "center",
  },
  arrows: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  dots: { flexDirection: "row", marginTop: 15 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: { backgroundColor: "#007B83" },
  startBtn: {
    marginTop: 30,
    backgroundColor: "#0097A7",
    padding: 15,
    borderRadius: 10,
  },
  startText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
