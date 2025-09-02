import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import your patient screens
import PatientDashboard from "../screens/Patient/PatientDashboard";
import PatientProfile from "../screens/Patient/PatientProfile";

// Dummy Home Screen
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Patient Home</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function PatientBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2A4D9B", // active icon/text color
        tabBarInactiveTintColor: "gray", // inactive icon/text color
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Dashboard") iconName = "bar-chart";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={PatientDashboard} />
      <Tab.Screen name="Profile" component={PatientProfile} />
    </Tab.Navigator>
  );
}
