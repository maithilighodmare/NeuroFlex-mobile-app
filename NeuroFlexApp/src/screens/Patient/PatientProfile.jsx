import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";

const patient = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  phone: "+91 98765 43210",
  address: "123, Green Street, Nagpur",
  condition: "Post-Stroke Rehab",
  sessionsCompleted: 12,
  ongoingSessions: 3,
  recoveryRate: "70%",
  image:
    "https://cdn-icons-png.flaticon.com/512/147/147144.png"
};

export default function PatientProfile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={{ uri: patient.image }} style={styles.avatar} />
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.specialization}>{patient.condition}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📧 {patient.email}</Text>
          <Text style={styles.infoText}>📞 {patient.phone}</Text>
          <Text style={styles.infoText}>🏠 {patient.address}</Text>
          <Text style={styles.infoText}>🎂 Age: {patient.age}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{patient.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{patient.ongoingSessions}</Text>
            <Text style={styles.statLabel}>Ongoing</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{patient.recoveryRate}</Text>
            <Text style={styles.statLabel}>Recovery</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2ff" },
  scrollContent: { padding: 20, paddingBottom: 100 }, // extra space so navbar is visible

  header: {
    alignItems: "center",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    padding: 30,
    marginBottom: 20
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  specialization: { fontSize: 16, color: "#e0dfff", marginTop: 5 },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  infoText: { fontSize: 14, marginBottom: 8, color: "#333" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#7B61FF" },
  statLabel: { marginTop: 5, fontSize: 12, color: "#555" },

  button: {
    backgroundColor: "#7B61FF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
