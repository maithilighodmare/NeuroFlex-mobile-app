import React, { useState,useEffect } from "react";
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
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

const patientData = {
  name: "Aashvi Tekade",
  role: "Buyer",
  username: "aashvitekade_",
  gender: "Male",
  phone: "+44 1632 960860",
  email: "aashvitekade@email.com",
  image: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
};



export default function PatientProfile() {
  const [patient, setPatient] = useState(patientData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);


    useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        patientData.name = data.name;
        patientData.email = data.email;
        patientData.role = data.role;
      }
    };

    loadUser();
  }, []);

  const handleSave = () => {
    setModalVisible(false);
  };

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
              ios_backgroundColor="#3e3e3e"
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
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton}>
          <Icon
            name="log-out"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
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
                onChangeText={(text) => setPatient({ ...patient, name: text })}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={patient.username}
                onChangeText={(text) =>
                  setPatient({ ...patient, username: text })
                }
                placeholder="Username"
              />
              <TextInput
                style={styles.input}
                value={patient.gender}
                onChangeText={(text) =>
                  setPatient({ ...patient, gender: text })
                }
                placeholder="Gender"
              />
              <TextInput
                style={styles.input}
                value={patient.phone}
                onChangeText={(text) => setPatient({ ...patient, phone: text })}
                placeholder="Phone Number"
              />
              <TextInput
                style={styles.input}
                value={patient.email}
                onChangeText={(text) => setPatient({ ...patient, email: text })}
                placeholder="Email"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
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
