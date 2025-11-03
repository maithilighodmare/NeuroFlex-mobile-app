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
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PatientProfile({ navigation }) {
  const [patient, setPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Load user from AsyncStorage
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

  // ✅ Save updated data to backend + AsyncStorage
  const handleSave = async () => {
    try {
      setSaving(true);

      const stored = await AsyncStorage.getItem("data");
      const parsed = JSON.parse(stored);

      // ✅ HIT BACKEND UPDATE API
      const res = await axios.put(
        "https://neuro-flex-mat-backend.vercel.app/user/update",
        {
          name: patient.name,
          age: patient.age,
        },
        {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
          },
        }
      );

      // ✅ NEW UPDATED USER
      const updatedUser = {
        ...parsed,
        name: res.data.user.name,
        age: res.data.user.age,
      };

      // ✅ Save updated data to AsyncStorage
      await AsyncStorage.setItem("data", JSON.stringify(updatedUser));

      // ✅ Update UI
      setPatient(updatedUser);

      setSaving(false);
      setModalVisible(false);

      Alert.alert("Updated ✅", "Profile updated successfully.");
    } catch (error) {
      setSaving(false);
      console.log("Update error:", error);
      Alert.alert("Error", "Could not update profile.");
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
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: patient.image }} style={styles.avatar} />
            <TouchableOpacity style={styles.editIcon}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.role}>{patient.role}</Text>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="user" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
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

        {/* Edit Modal */}
        <Modal animationType="slide" transparent visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.backButton}
              >
                <Icon name="chevron-left" size={28} color="#28AFB0" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TextInput
                style={styles.input}
                value={patient.name}
                onChangeText={(t) => setPatient({ ...patient, name: t })}
              />

              <TextInput
                style={styles.input}
                value={String(patient.age)}
                onChangeText={(t) => setPatient({ ...patient, age: t })}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

//
// ✅ ALL YOUR STYLES — NO CHANGE
//
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    marginTop: 5,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 80,
  },
  imageContainer: {
    position: "relative",
  },
  avatar: {
    width: 210,
    height: 210,
    borderRadius: 55,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#28AFB0",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#000",
  },
  role: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
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
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#28AFB0",
    borderRadius: 25,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
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
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  backButton: {
    position: "absolute",
    left: 10,
    top: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#28AFB0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
