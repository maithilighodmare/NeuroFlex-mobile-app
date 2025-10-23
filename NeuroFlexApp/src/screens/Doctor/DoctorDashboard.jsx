import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Patient data
const patients = [
  { id: "NF001", name: "Dipak Mundhe", initials: "DM", recovery: "78%", status: "Active now", color: "#28AFB0" },
  { id: "NF002", name: "Amogh Nagarkar", initials: "AN", recovery: "90%", status: "Active now", color: "#28AFB0" },
  { id: "NF003", name: "Riddhi Patil", initials: "RP", recovery: "85%", status: "2 hours ago", color: "#28AFB0" },
  { id: "NF004", name: "Sahil Atram", initials: "SA", recovery: "62%", status: "2 days ago", color: "#28AFB0" },
  { id: "NF005", name: "Ishu Patil", initials: "IP", recovery: "73%", status: "30 min ago", color: "#28AFB0" },
  { id: "NF006", name: "Riya Meshram", initials: "RM", recovery: "78%", status: "Active now", color: "#28AFB0" },
];

export default function DoctorDashboard() {
  const navigation = useNavigation();

  const renderPatient = ({ item }) => (
    <View style={styles.patientCard}>
      {/* Initials Circle */}
      <View style={[styles.initialCircle, { backgroundColor: item.color }]}>
        <Text style={styles.initials}>{item.initials}</Text>
      </View>

      {/* Patient Info */}
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientId}>ID : {item.id}</Text>
        <Text style={[styles.status, item.status.includes("Active") ? { color: "#28AFB0" } : { color: "#293132" }]}>
          {item.status}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.detailsSection}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("PatientDetails", { patient: item })}
        >
          <Text style={styles.detailsText}>View Details</Text>
        </TouchableOpacity>
        <Text style={styles.recovery}>{item.recovery} Recovery</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Neuroflex Mat</Text>
          <Text style={styles.subtitle}>Doctor Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.doctorCircle}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.doctorInitials}>DM</Text>
          <Text style={styles.doctorName}>Dr. Maithili</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Sessions Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Active Patients</Text>
        </View>
      </View>

      {/* Patient Overview */}
      <Text style={styles.sectionTitle}>Patient Overview</Text>
      <Text style={styles.sectionSubtitle}>Tap any patient to view detailed progress</Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDFD", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#28AFB0",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFFDFD" },
  subtitle: { fontSize: 14, color: "#E0E0E0" },
  doctorCircle: { alignItems: "center" },
  doctorInitials: {
    backgroundColor: "#FFFDFD",
    color: "#293132",
    fontWeight: "bold",
    padding: 12,
    borderRadius: 25,
    marginBottom: 4,
  },
  doctorName: { color: "#FFFDFD", fontSize: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
 statCard: {
  flex: 1,
  marginHorizontal: 6,
  backgroundColor: "#FFFDFD",
  borderRadius: 10,
  padding: 12,
  alignItems: "center",
  shadowColor: "#28AFB0",
  shadowOpacity: 0.5,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
},


  statNumber: { fontSize: 18, fontWeight: "bold", color: "#28AFB0" },
  statLabel: { fontSize: 12, color: "#293132" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#293132" },
  sectionSubtitle: { fontSize: 12, color: "#293132", marginBottom: 8 },
  patientCard: {
    flexDirection: "row",
    backgroundColor: "#FFFDFD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  initialCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 10 },
  initials: { color: "#FFFDFD", fontWeight: "bold" },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 14, fontWeight: "bold", color: "#293132" },
  patientId: { fontSize: 12, color: "#293132" },
  status: { fontSize: 12, marginTop: 2 },
  detailsSection: { alignItems: "flex-end" },
  detailsButton: { backgroundColor: "#28AFB0", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 4 },
  detailsText: { color: "#FFFDFD", fontSize: 12, fontWeight: "bold" },
  recovery: { fontSize: 12, color: "#293132" },
});
