import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";

const doctor = {
  name: "Dr. Ayesha Khan",
  specialization: "Physiotherapist",
  email: "ayesha.khan@hospital.com",
  phone: "+91 98765 43210",
  hospital: "CityCare Hospital",
  experience: "10 Years",
  patients: 120,
  ongoing: 8,
  successRate: "95%",
  image:
    "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
};

export default function DoctorProfile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={{ uri: doctor.image }} style={styles.avatar} />
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📧 {doctor.email}</Text>
          <Text style={styles.infoText}>📞 {doctor.phone}</Text>
          <Text style={styles.infoText}>🏥 {doctor.hospital}</Text>
          <Text style={styles.infoText}>⏳ Experience: {doctor.experience}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{doctor.patients}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{doctor.ongoing}</Text>
            <Text style={styles.statLabel}>Ongoing</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{doctor.successRate}</Text>
            <Text style={styles.statLabel}>Success</Text>
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
  scrollContent: { padding: 20, paddingBottom: 100 }, // ⬅️ extra space so navbar is visible
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
