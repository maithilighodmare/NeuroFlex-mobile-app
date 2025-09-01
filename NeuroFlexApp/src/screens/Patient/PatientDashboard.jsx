import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function PatientDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Patient Dashboard</Text>

      <Button
        title="Back to Signup"
        onPress={() => navigation.replace("Signup")}
        color="#7B61FF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
