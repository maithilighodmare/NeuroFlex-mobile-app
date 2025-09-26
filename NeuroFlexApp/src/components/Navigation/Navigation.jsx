import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DoctorDashboard from "../../screens/Patient/DoctorDashboard"; // if exists
import PatientDetails from "../../screens/Patient/PatientDetails"; // if exists



const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PatientApp" component={PatientBottomNav} />
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
