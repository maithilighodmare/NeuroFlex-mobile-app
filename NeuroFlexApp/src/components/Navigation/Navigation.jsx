import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DoctorDashboard from "./DoctorDashboard";
import PatientDetails from "./PatientDetails";
import PatientProfile from "./PatientProfile";
import PatientDashboard from "./PatientDashboard";


const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />
        <Stack.Screen name="PatientProfile" component={PatientProfile}/>
        <Stack.Screen name="PatientDashboard" component={PatientDashboard}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
