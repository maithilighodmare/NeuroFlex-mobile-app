import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function DoctorDashboard() {
  const navigation = useNavigation();

  const [doctor, setDoctor] = useState({ name: "Doctor", initials: "DR" });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);       // ✅ page loading
  const [fetchLoading, setFetchLoading] = useState(false); // ✅ button loading

  // ✅ Load doctor
  useEffect(() => {
    const loadDoctor = async () => {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const user = JSON.parse(data);

        const initials = user.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        setDoctor({
          name: user.name,
          initials: initials || "DR",
        });
      }
    };
    loadDoctor();
  }, []);

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      setFetchLoading(true);

      const res = await axios.get(
        "https://neuro-flex-mat-backend-hmxu.vercel.app/doctor/userlist"
      );

      setUsers(res.data.users);
    } catch (err) {
      console.log("Fetch error:", err.response?.data);
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  // ✅ Auto load users
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Loading Skeleton screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#28AFB0" />
        <Text style={{ marginTop: 10, color: "#28AFB0" }}>Loading...</Text>
      </View>
    );
  }

  const renderUser = ({ item }) => {
    const initials =
      item.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "NA";

    return (
      <View style={styles.patientCard}>
        <View style={[styles.initialCircle, { backgroundColor: "#28AFB0" }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientId}>ID : {item._id}</Text>
          <Text style={[styles.status, { color: "#28AFB0" }]}>Active</Text>
        </View>

        <View style={styles.detailsSection}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("PatientDetails", { patient: item })
            }
          >
            <Text style={styles.detailsText}>View Details</Text>
          </TouchableOpacity>

          <Text style={styles.recovery}>N/A Recovery</Text>
        </View>
      </View>
    );
  };

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
          <Text style={styles.doctorInitials}>{doctor.initials}</Text>
          <Text style={styles.doctorName}>{doctor.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Active Patients</Text>
        </View>
      </View>

      {/* ✅ GET USERS BUTTON WITH LOADING */}
      <TouchableOpacity
        onPress={fetchUsers}
        style={{
          backgroundColor: "#28AFB0",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 10,
        }}
        disabled={fetchLoading}
      >
        {fetchLoading ? (
          <ActivityIndicator size="small" color="#FFFDFD" />
        ) : (
          <Text style={{ color: "#FFFDFD", fontWeight: "bold" }}>Get Users</Text>
        )}
      </TouchableOpacity>

      {/* List */}
      <Text style={styles.sectionTitle}>Patients</Text>
      <Text style={styles.sectionSubtitle}>
        Tap a patient to view detailed progress
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
      />
    </View>
  );
}

//
// ✅ ORIGINAL STYLES (unchanged)
//
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
  detailsButton: {
    backgroundColor: "#28AFB0",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
  },
  detailsText: { color: "#FFFDFD", fontSize: 12, fontWeight: "bold" },
  recovery: { fontSize: 12, color: "#293132" },
});
