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

// Dummy Settings Screen
function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function PatientBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2A4D9B", // active color
        tabBarInactiveTintColor: "gray", // inactive color
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
          else if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={PatientDashboard} />
      <Tab.Screen name="Profile" component={PatientProfile} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
