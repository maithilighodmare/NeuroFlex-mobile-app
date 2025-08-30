import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import DoctorDashboard from "./src/screens/Doctor/DoctorDashboard";
import PatientDetails from "./src/screens/Doctor/PatientDetails";
import DoctorProfile from "./src/screens/Doctor/DoctorProfile";
// Placeholder screens
function HomeScreen() {
  return null;
}
function ProfileScreen() {
  return null;
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs for Doctor
function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Dashboard") iconName = "bar-chart-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7B61FF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DoctorDashboard} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {/* Tabs as main screen */}
        <Stack.Screen
          name="Doctor"
          component={DoctorTabs}
          options={{ headerShown: false }}
        />

        {/* Patient details screen */}
        <Stack.Screen
          name="PatientDetails"
          component={PatientDetails}
          options={{ title: "Patient Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
