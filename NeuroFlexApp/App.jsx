import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import DoctorDashboard from "./src/screens/Doctor/DoctorDashboard";
import PatientDetails from "./src/screens/Doctor/PatientDetails";
import DoctorProfile from "./src/screens/Doctor/DoctorProfile";
import PatientDashboard from "./src/screens/Patient/PatientDashboard";

// New Screens
import SplashScreen from "./src/screens/Onboarding/SplashScreen";
import Login from "./src/screens/Auth/Login/Login";
import Signup from "./src/screens/Auth/Signup/Signup";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Doctor Tabs
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
      <Tab.Screen name="Home" component={DoctorDashboard} />
      <Tab.Screen name="Dashboard" component={DoctorDashboard} />
      <Tab.Screen name="Profile" component={DoctorProfile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Splash">
        {/* Splash */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Auth */}
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

        {/* Doctor Flow */}
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

        {/* Patient Flow */}
        <Stack.Screen
          name="Patient"
          component={PatientDashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
