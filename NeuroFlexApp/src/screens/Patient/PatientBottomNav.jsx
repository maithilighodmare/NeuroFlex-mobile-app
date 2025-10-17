import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./HomeScreen";
import PatientDashboard from "./PatientDashboard";
import PatientProfile from "./PatientProfile";

const Tab = createBottomTabNavigator();

export default function PatientBottomNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#28AFB0", // primary blue
        tabBarInactiveTintColor: "#293132", // dark color
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          backgroundColor: "#FFFDFD", // white background
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
