import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width - 40;

const patient = {
  name: "Dipak Mundhe",
  id: "INFO01",
  recovery: 78,
  sessions: 24,
  compliance: 92,
  progress: { week1: 20, week2: 35, week3: 50, week4: 70, week5: 85 },
};

export default function PatientDetails() {
  const stats = [
    { label: "Recovery", value: `${patient.recovery}%`, color: "#28AFB0", icon: "healing" },
    { label: "Sessions", value: patient.sessions, color: "#28AFB0", icon: "event" },
    { label: "Compliance", value: `${patient.compliance}%`, color: "#28AFB0", icon: "check-circle" },
    { label: "Attendance", value: "95%", color: "#28AFB0", icon: "access-time" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.id}>Patient ID: {patient.id}</Text>
      </View>

      {/* Stats 2 per row */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
            <MaterialIcons name={stat.icon} size={24} color="#FFFDFD" style={{ marginBottom: 8 }} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recovery Progress Graph */}
      <Text style={styles.sectionTitle}>Recovery Progress</Text>
      <BarChart
        data={{
          labels: Object.keys(patient.progress),
          datasets: [
            {
              data: Object.values(patient.progress),
            },
          ],
        }}
        width={screenWidth}
        height={240}
        fromZero
        yAxisSuffix="%"
        showValuesOnTopOfBars
        chartConfig={{
          backgroundGradientFrom: "#FFFDFD",
          backgroundGradientTo: "#FFFDFD",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(40,175,176,${opacity})`, // Blue bars
          labelColor: (opacity = 1) => `rgba(41,49,50, ${opacity})`, // Dark labels
          barPercentage: 0.6,
        }}
        style={{ borderRadius: 16, marginVertical: 12 }}
      />

      {/* Overall Recovery */}
      <Text style={styles.sectionTitle}>Overall Recovery</Text>
      <Progress.Bar
  progress={patient.recovery / 100}
  width={screenWidth}
  height={18}
  borderRadius={12}
  color="#28AFB0"        
  unfilledColor="#FFFDFD"   
  borderWidth={0.8}           
  borderColor="#293132"     
  animated={true}
  style={{ marginBottom: 20 }}
/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDFD" },
  header: { backgroundColor: "#28AFB0", borderRadius: 16, padding: 20, marginBottom: 20 },
  name: { color: "#FFFDFD", fontSize: 22, fontWeight: "bold" },
  id: { color: "#FFFDFD", marginTop: 5, fontSize: 14 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#28AFB0",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#FFFDFD" },
  statLabel: { marginTop: 4, fontSize: 12, color: "#FFFDFD" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 12, color: "#293132" },
});
