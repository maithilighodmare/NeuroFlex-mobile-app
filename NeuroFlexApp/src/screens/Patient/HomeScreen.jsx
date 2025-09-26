import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function HomeScreen() {
  useEffect(() => {
    console.log("🏠 HomeScreen rendered");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Home Screen</Text>
    </View>
  );
}
