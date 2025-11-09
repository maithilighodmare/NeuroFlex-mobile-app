import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PatientProfile({ navigation }) {
  const [patient, setPatient] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ✅ Load user
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsed = JSON.parse(data);
        setPatient({
          ...parsed,
          age: parsed.age ? String(parsed.age) : "",
          image:
            parsed.image || "https://cdn-icons-png.flaticon.com/512/147/147144.png",
        });
      }
    } catch (e) {
      console.log("Load user error:", e);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.post(
        "http://192.168.213.204:4000/doctor/delete",
        { email: patient.email }
      );

      await AsyncStorage.removeItem("data");
      setDeleting(false);
      setDeleteModal(false);

      Alert.alert("Deleted ✅", "Your doctor account has been removed.");
      navigation.replace("Login");
    } catch (error) {
      setDeleting(false);
      console.log("Delete Error:", error.response?.data || error.message);
      Alert.alert("Error", "Could not delete account.");
    }
  };

  if (!patient) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#28AFB0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: patient.image }} style={styles.avatar} />
          </View>

          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.role}>{patient.role}</Text>
        </View>

        {/* ✅ Now we only display user info — NO EDIT */}
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="user" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Name: {patient.name}</Text>
            </View>
          </View>

      

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="mail" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Email: {patient.email}</Text>
            </View>
          </View>
        </View>

        {/* ✅ Delete Account */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: "red", marginTop: 15 }]}
          onPress={() => setDeleteModal(true)}
        >
          <Icon name="trash" size={18} color="#fff" />
          <Text style={styles.signOutText}>Delete Account</Text>
        </TouchableOpacity>

        {/* ✅ Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("data");
            navigation.replace("Login");
          }}
        >
          <Icon name="log-out" size={18} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* ✅ Delete Confirm Modal */}
        <Modal transparent visible={deleteModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Account?</Text>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                This action cannot be undone.
              </Text>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: "red" }]}
                onPress={handleDeleteAccount}
              >
                {deleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Yes, Delete</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { marginTop: 10, backgroundColor: "#28AFB0" }]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.saveText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

//
// ✅ STYLES — UNCHANGED
//
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F6FA", marginTop: 5 },
  scrollContent: { alignItems: "center", paddingVertical: 30 },
  headerContainer: { alignItems: "center", marginBottom: 25, marginTop: 80 },
  imageContainer: { position: "relative" },
  avatar: { width: 210, height: 210, borderRadius: 55 },
  name: { fontSize: 20, fontWeight: "bold", marginTop: 12, color: "#000" },
  role: { fontSize: 14, color: "#777", marginTop: 4 },
  menuContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconWrapper: {
    backgroundColor: "#28AFB0",
    borderRadius: 25,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuText: { fontSize: 16, color: "#333" },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#28AFB0",
    borderRadius: 12,
    width: "90%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 8,
  },
  signOutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28AFB0",
    textAlign: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#28AFB0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
