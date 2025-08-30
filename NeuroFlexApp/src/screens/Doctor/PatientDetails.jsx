import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width - 40;

const patient = {
  name: "Dipak Mundhe",
  id: "INFO01",
  recovery: 78,
  sessions: 24,
  compliance: 92,
  progress: { week1: 20, week2: 35, week3: 50, week4: 70, week5: 85 },
  recentSessions: [
    { id: 5, date: "Today", status: "Complete" },
    { id: 4, date: "Yesterday", status: "Complete" }
  ]
};

export default function PatientDetails() {
  const stats = [
    { label: "Recovery", value: `${patient.recovery}%` },
    { label: "Sessions", value: patient.sessions },
    { label: "Compliance", value: `${patient.compliance}%` }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.name}>{patient.name}</Text>
            <Text style={styles.id}>Patient ID: {patient.id}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats: horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Recovery Progress Graph */}
      <Text style={styles.sectionTitle}>Recovery Progress</Text>
      <BarChart
        data={{
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
          datasets: [{ data: Object.values(patient.progress) }]
        }}
        width={screenWidth}
        height={220}
        yAxisSuffix="%"
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#7B61FF" }
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* Rounded progress bar below chart */}
      <Text style={styles.sectionTitle}>Overall Recovery</Text>
      <Progress.Bar
        progress={patient.recovery / 100}
        width={screenWidth}
        height={15}
        borderRadius={10}
        color="#7B61FF"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        style={{ marginBottom: 20 }}
      />

      {/* Recent Sessions */}
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      {patient.recentSessions.map(session => (
        <View key={session.id} style={styles.sessionBox}>
          <Text style={styles.sessionText}>Session {session.id} - {session.date}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: session.status === "Complete" ? "#4CAF50" : "#FFC107" }
            ]}
          >
            <Text style={styles.statusText}>{session.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2ff" },
  header: { backgroundColor: "#7B61FF", borderRadius: 16, padding: 20, marginBottom: 20 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  id: { color: "#fff", marginTop: 5, fontSize: 14 },
  closeButton: { backgroundColor: "#5a45cc", borderRadius: 12, padding: 6 },
  closeText: { color: "#fff", fontWeight: "bold" },
  statsScroll: { marginBottom: 20 },
  statBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#f0e9e9ff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minWidth: 120
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#7B61FF" },
  statLabel: { marginTop: 5, fontSize: 12, color: "#555" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, color: "#333" },
  sessionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  sessionText: { fontSize: 14 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { color: "#fff", fontWeight: "bold" }
});
