import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PatientProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Profile</Text>
      <Text style={styles.info}>Name: John Doe</Text>
      <Text style={styles.info}>Age: 30</Text>
      <Text style={styles.info}>Email: john@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2A4D9B",
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    color: "#333",
  },
});
