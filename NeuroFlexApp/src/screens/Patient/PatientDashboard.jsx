import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width - 40;

const patient = {
  name: "Dipak Mundhe",
  id: "INFO01",
  recovery: 78,
  sessions: 24,
  compliance: 92,
  recentSessions: [
    { id: 5, date: "Today", status: "Complete" },
    { id: 4, date: "Yesterday", status: "Complete" },
  ],
};

const chartData = {
  Daily: {
    Hand: [320, 310, 305, 300, 295, 290, 285],
    Leg: [450, 440, 430, 420, 410, 400, 390],
    Overall: [385, 375, 370, 360, 350, 345, 340],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  Weekly: {
    Hand: [310, 300, 290, 280],
    Leg: [440, 420, 400, 380],
    Overall: [375, 360, 345, 330],
    labels: ["W1", "W2", "W3", "W4"],
  },
  Monthly: {
    Hand: [300, 290, 280, 270],
    Leg: [420, 410, 390, 370],
    Overall: [365, 350, 335, 320],
    labels: ["Jan", "Feb", "Mar", "Apr"],
  },
};

const categories = ["Overall", "Hand", "Leg"];

export default function PatientDashboard() {
  const [filter, setFilter] = useState("Weekly");
  const [category, setCategory] = useState("Overall");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const stats = [
    { label: "Recovery", value: `${patient.recovery}%` },
    { label: "Sessions", value: patient.sessions },
    { label: "Compliance", value: `${patient.compliance}%` },
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

      {/* Stats */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Filters + Category */}
      <View style={styles.filterRow}>
        {["Daily", "Weekly", "Monthly"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterBtn,
              filter === item && styles.filterBtnActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Custom Category Dropdown */}
        <TouchableOpacity
          style={styles.dropdownBtn}
          onPress={() => setDropdownOpen(true)}
        >
          <Text style={styles.dropdownText}>{category}</Text>
        </TouchableOpacity>
        <Modal transparent visible={dropdownOpen} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownOpen(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.modalText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Recovery Progress Graph */}
      <Text style={styles.sectionTitle}>Recovery Progress</Text>
      <BarChart
        data={{
          labels: chartData[filter].labels,
          datasets: [{ data: chartData[filter][category] }],
        }}
        width={screenWidth}
        height={220}
        yAxisSuffix="ms"
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* Overall Recovery Progress */}
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
      {patient.recentSessions.map((session) => (
        <View key={session.id} style={styles.sessionBox}>
          <Text style={styles.sessionText}>
            Session {session.id} - {session.date}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  session.status === "Complete" ? "#4CAF50" : "#FFC107",
              },
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
  header: {
    backgroundColor: "#7B61FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
    minWidth: 120,
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#7B61FF" },
  statLabel: { marginTop: 5, fontSize: 12, color: "#555" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  filterBtnActive: { backgroundColor: "#7B61FF", borderColor: "#7B61FF" },
  filterText: { color: "gray", fontSize: 14 },
  filterTextActive: { color: "#fff", fontWeight: "bold" },
  dropdownBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: "auto",
  },
  dropdownText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 200,
    paddingVertical: 10,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalText: { fontSize: 14, color: "#333" },
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
    elevation: 3,
  },
  sessionText: { fontSize: 14 },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: { color: "#fff", fontWeight: "bold" },
});
