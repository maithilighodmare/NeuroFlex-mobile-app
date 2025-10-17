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

const patientData = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  phone: "+91 98765 43210",
  address: "123, Green Street, Nagpur",
  condition: "Post-Stroke Rehab",
  sessionsCompleted: 12,
  ongoingSessions: 3,
  recoveryRate: "70%",
  image: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
};

export default function PatientProfile() {
  const [patient, setPatient] = useState(patientData);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={{ uri: patient.image }} style={styles.avatar} />
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.condition}>{patient.condition}</Text>
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
                value={patient.name}
                onChangeText={(text) => setPatient({ ...patient, name: text })}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={patient.condition}
                onChangeText={(text) =>
                  setPatient({ ...patient, condition: text })
                }
                placeholder="Condition"
              />
              <TextInput
                style={styles.input}
                value={patient.email}
                onChangeText={(text) =>
                  setPatient({ ...patient, email: text })
                }
                placeholder="Email"
              />
              <TextInput
                style={styles.input}
                value={patient.phone}
                onChangeText={(text) =>
                  setPatient({ ...patient, phone: text })
                }
                placeholder="Phone"
              />
              <TextInput
                style={styles.input}
                value={patient.address}
                onChangeText={(text) =>
                  setPatient({ ...patient, address: text })
                }
                placeholder="Address"
              />
              <TextInput
                style={styles.input}
                value={String(patient.age)}
                onChangeText={(text) =>
                  setPatient({ ...patient, age: text })
                }
                placeholder="Age"
                keyboardType="numeric"
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
  safeArea: { flex: 1, backgroundColor: "#FFFDFD" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: {
    alignItems: "center",
    backgroundColor: "#28AFB0",
    borderRadius: 25,
    paddingTop: 40,
    marginTop: 30,
    paddingBottom: 40,
    marginBottom: 20,
    shadowColor: "#28AFB0",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", color: "#FFFDFD" },
  condition: { fontSize: 16, color: "#FFFDFD", marginTop: 5 },

  infoCard: {
    backgroundColor: "#FFFDFD",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: { fontSize: 14, marginBottom: 8, color: "#293132" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#FFFDFD",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#28AFB0" },
  statLabel: { marginTop: 5, fontSize: 12, color: "#293132" },

  button: {
    backgroundColor: "#28AFB0",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFFDFD", fontSize: 16, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFDFD",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#28AFB0",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    color: "#293132",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
});
