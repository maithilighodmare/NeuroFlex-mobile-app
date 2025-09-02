import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PatientDashboard() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Patient Dashboard</Text>

      <Button
        title="Back to Signup"
        onPress={() => navigation.navigate("Signup")}
        color="#7B61FF"
      />

      <Button 
      title="PatientProfile"
      onPress={()=>  navigation.navigate("PatientProfile")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FF", // light background for clean UI
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2A4D9B", // match with your theme
  },
});
