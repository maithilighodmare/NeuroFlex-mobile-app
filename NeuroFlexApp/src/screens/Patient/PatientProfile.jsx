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
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PatientProfile({ navigation }) {
  const [patient, setPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // ✅ NEW
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false); // ✅ NEW

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  // ✅ Load user data from storage
  const loadUser = async () => {
    try {
      let data = await AsyncStorage.getItem("data");

      if (data) {
        const parsed = JSON.parse(data);

        setPatient({
          _id: parsed._id,
          name: parsed.name || "",
          email: parsed.email || "",
          role: parsed.role || "",
          age: parsed.age ? String(parsed.age) : "",
          token: parsed.token || "",
          image:
            parsed.image ||
            "https://cdn-icons-png.flaticon.com/512/147/147144.png",
        });
      }
    } catch (e) {
      console.log("Error loading user:", e);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadUser();
      setLoading(false);
    };
    load();
  }, []);

  // ✅ Save updated profile
  const handleSave = async () => {
    try {
      const stored = await AsyncStorage.getItem("data");
      const parsed = JSON.parse(stored);

      const res = await axios.put(
        "https://neuro-flex-mat-backend-hmxu.vercel.app/user/update",
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

      const updatedUser = {
        ...parsed,
        name: res.data.user.name,
        age: res.data.user.age,
      };

      await AsyncStorage.setItem("data", JSON.stringify(updatedUser));
      setPatient(updatedUser);

      setModalVisible(false);
      Alert.alert("Saved ✅", "Profile updated successfully.");
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  // ✅ Refresh profile
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
    Alert.alert("Refreshed ✅", "User data updated.");
  };

  // ✅ SIGN OUT
  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await AsyncStorage.removeItem("data");

      setTimeout(() => {
        setSigningOut(false);
        Alert.alert("Logged Out ✅", "You have been signed out.");

        navigation.replace("Login");
      }, 1200);
    } catch (err) {
      setSigningOut(false);
      Alert.alert("Error", "Could not sign out. Try again.");
    }
  };

  // ✅ DELETE ACCOUNT API
const handleDeleteAccount = async () => {
  setDeleting(true);

  try {
    const stored = await AsyncStorage.getItem("data");
    const parsed = JSON.parse(stored);

    await axios.delete(
      "https://neuro-flex-mat-backend-hmxu.vercel.app/user/delete",
      {
        headers: {
          Authorization: `Bearer ${parsed.token}`,  // ✅ FIXED
        },
        data: { email: patient.email },
      }
    );

    await AsyncStorage.removeItem("data");

    setDeleting(false);
    setDeleteModalVisible(false);

    Alert.alert("Deleted ✅", "Your account has been permanently deleted.");
    navigation.replace("Login");
  } catch (error) {
    setDeleting(false);
    console.log("❌ Delete error:", error.response?.data || error.message);
    Alert.alert("Error", "Could not delete. Try again.");
  }
};


  if (loading || !patient) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#28AFB0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={handleRefresh}
          style={{ marginTop: 30, marginBottom: -50 }}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#28AFB0" />
          ) : (
            <Icon name="refresh-ccw" size={28} color="#28AFB0" />
          )}
        </TouchableOpacity>

        {/* Header */}
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

        {/* Menu */}
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

          {/* NOTIFICATION */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="bell" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Notification</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#34C759" }}
              thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="map-pin" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Address</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconWrapper}>
                <Icon name="lock" size={20} color="#fff" />
              </View>
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Icon name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>

          {/* ✅ DELETE ACCOUNT BUTTON */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setDeleteModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: "#ff4444" }]}>
                <Icon name="trash" size={20} color="#fff" />
              </View>
              <Text style={[styles.menuText, { color: "#ff4444" }]}>
                Delete Account
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color="#ff4444" />
          </TouchableOpacity>
        </View>

        {/* ✅ Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="log-out" size={18} color="#fff" />
              <Text style={styles.signOutText}>  Sign Out</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ✅ EDIT PROFILE MODAL (UNCHANGED) */}
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
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ✅ DELETE CONFIRMATION MODAL */}
        <Modal animationType="fade" transparent visible={deleteModalVisible}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { paddingTop: 40, paddingBottom: 30 },
              ]}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: "#333",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Are you sure you want to delete your account?
              </Text>

              {deleting ? (
                <ActivityIndicator size="large" color="#ff4444" />
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { backgroundColor: "#ff4444", marginBottom: 10 },
                    ]}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.saveText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { backgroundColor: "#28AFB0" },
                    ]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.saveText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ NO STYLE MODIFIED BELOW
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
