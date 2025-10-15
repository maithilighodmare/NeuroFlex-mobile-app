import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";

const doctorData = {
  name: "Dr. Maithili",
  specialization: "Neurological Physiotherapist",
  email: "maithili@neurocarehospital.com",
  phone: "+91 98765 12345",
  hospital: "NeuroCare Hospital",
  experience: "8 Years",
  patients: 245,
  ongoing: 12,
  successRate: "97%",
  image: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
};

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(doctorData);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    // You can add API integration here to save changes
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Image source={{ uri: doctor.image }} style={styles.avatar} />
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.specialization}>{doctor.specialization}</Text>
          </View>
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
            <Text style={styles.statLabel}>Ongoing Cases</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{doctor.successRate}</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              {/* Editable Fields */}
              <TextInput
                style={styles.input}
                value={doctor.name}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, name: text })
                }
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={doctor.specialization}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, specialization: text })
                }
                placeholder="Specialization"
              />
              <TextInput
                style={styles.input}
                value={doctor.email}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, email: text })
                }
                placeholder="Email"
              />
              <TextInput
                style={styles.input}
                value={doctor.phone}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, phone: text })
                }
                placeholder="Phone"
              />
              <TextInput
                style={styles.input}
                value={doctor.hospital}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, hospital: text })
                }
                placeholder="Hospital"
              />
              <TextInput
                style={styles.input}
                value={doctor.experience}
                onChangeText={(text) =>
                  setDoctor({ ...doctor, experience: text })
                }
                placeholder="Experience"
              />

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginRight: 5 }]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { flex: 1, backgroundColor: "#999", marginLeft: 5 },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Header
  header: {
    alignItems: "center",
    backgroundColor: "#2A4D9B",
    borderRadius: 25,
    paddingTop: 60,
    paddingBottom: 50,
    marginBottom: 25,
    marginTop: 20,
    shadowColor: "#2A4D9B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  headerInner: {
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  specialization: {
    fontSize: 16,
    color: "#D9E3FF",
    marginTop: 4,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#333",
  },

  // Stats Section
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: "#F3F6FB",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    shadowColor: "#2A4D9B",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E1E6F0",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A4D9B",
  },
  statLabel: {
    marginTop: 5,
    fontSize: 13,
    color: "#555",
    letterSpacing: 0.5,
  },

  // Button
  button: {
    backgroundColor: "#2A4D9B",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#2A4D9B",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2A4D9B",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
});
