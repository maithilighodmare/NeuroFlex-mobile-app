// src/screens/Onboarding/SplashScreen.jsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

export default function SplashScreen({ navigation }) {
  const translateY = new Animated.Value(100); // start below screen
  const opacity = new Animated.Value(0);

  useEffect(() => {
    // Animate text popping up
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 3s
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity, transform: [{ translateY }] }]}
      >
        NeuroFlex
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B61FF", // your blue shade
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});
