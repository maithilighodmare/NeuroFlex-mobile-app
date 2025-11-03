import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import DoctorDashboard from "./src/screens/Doctor/DoctorDashboard";
import PatientDetails from "./src/screens/Doctor/PatientDetails";
import DoctorProfile from "./src/screens/Doctor/DoctorProfile";
import PatientDashboard from "./src/screens/Patient/PatientDashboard";
import PatientProfile from "./src/screens/Patient/PatientProfile";
import HomeScreen from "./src/screens/Patient/HomeScreen";
import SplashScreen from "./src/screens/Onboarding/SplashScreen";
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";

//ChatBot
import ChatBot from "./src/screens/chatbot/ChatBot";

import Login from "./src/screens/Auth/Login/Login";
import Signup from "./src/screens/Auth/Signup/Signup";
import ChatBotScreen from "./src/screens/chatbot/ChatBotScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Dashboard") iconName = "bar-chart-outline";
          else if (route.name === "ChatBot") iconName = "chatbubble-ellipses-outline"; // ✅ ADDED
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7B61FF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Dashboard" component={DoctorDashboard} />
      <Tab.Screen name="ChatBot" component={ChatBotScreen} />
      <Tab.Screen name="Profile" component={DoctorProfile} />
    </Tab.Navigator>
  );
}

function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Dashboard") iconName = "bar-chart-outline";
          else if (route.name === "ChatBot") iconName = "chatbubble-ellipses-outline"; // ✅ ADDED
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7B61FF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={PatientDashboard} />
      <Tab.Screen name="ChatBot" component={ChatBotScreen} />
      <Tab.Screen name="Profile" component={PatientProfile} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login state on mount + whenever storage changes
  useEffect(() => {
    const loadStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    };

    loadStatus();

    // ✅ Listen for login/logout updates
    const interval = setInterval(loadStatus, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Doctor"
          component={DoctorTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PatientDetails"
          component={PatientDetails}
          options={{ title: "Patient Details" }}
        />

        <Stack.Screen
          name="Patient"
          component={PatientTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ChatBotScreen"
          component={ChatBot}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

      {/* ✅ ChatBot shows ONLY when user is logged in */}
      {isLoggedIn && <ChatBot />}
    </NavigationContainer>
  );
}
