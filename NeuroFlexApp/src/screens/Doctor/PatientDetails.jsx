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
    { label: "Recovery", value: `${patient.recovery}%`, color: "#8E44AD", icon: "healing" },
    { label: "Sessions", value: patient.sessions, color: "#FF7F50", icon: "event" },
    { label: "Compliance", value: `${patient.compliance}%`, color: "#3CD070", icon: "check-circle" },
    { label: "Attendance", value: "95%", color: "#FFA500", icon: "access-time" },
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
            <MaterialIcons name={stat.icon} size={24} color="#fff" style={{ marginBottom: 8 }} />
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
          backgroundGradientFrom: "#f0f2ff",
          backgroundGradientTo: "#f0f2ff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(123,97,255,${opacity})`, // Purple bars
          labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
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
        color="#7B61FF"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        animated={true}
        style={{ marginBottom: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2ff" },
  header: { backgroundColor: "#7B61FF", borderRadius: 16, padding: 20, marginBottom: 20 },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  id: { color: "#fff", marginTop: 5, fontSize: 14 },

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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  statLabel: { marginTop: 4, fontSize: 12, color: "#fff" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 12, color: "#333" },
});
