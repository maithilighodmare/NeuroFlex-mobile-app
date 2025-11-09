import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function DoctorDashboard() {
  const navigation = useNavigation();

  const [doctor, setDoctor] = useState({
    name: "Doctor",
    initials: "DR",
    email: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [addLoadingEmail, setAddLoadingEmail] = useState("");

  const [dataModalVisible, setDataModalVisible] = useState(false);

  // ✅ FIX: selectedUserData always an array
  const [selectedUserData, setSelectedUserData] = useState([]);

  const [selectedUserForData, setSelectedUserForData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [deleteLoadingEmail, setDeleteLoadingEmail] = useState("");

  const BASE = "http://192.168.213.204:4000";

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const user = JSON.parse(data);
          const initials = user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          setDoctor({
            name: user.name || "Doctor",
            initials: initials || "DR",
            email: user.email || "",
          });
        } else {
          setDoctor((d) => ({ ...d }));
        }
      } catch (err) {
        console.log("loadDoctor error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, []);

  const fetchUsers = async () => {
    if (!doctor.email) {
      Alert.alert("No doctor email", "Please login as doctor to fetch users.");
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      setFetchLoading(true);

      const res = await axios.post(`${BASE}/doctor/getusers`, {
        email: doctor.email,
      });

      const doctorUsers = res?.data?.users ?? [];

      const normalized = doctorUsers.map((u) =>
        typeof u === "string"
          ? { email: u, name: u }
          : { email: u.email ?? u._id ?? "", name: u.name ?? u.email ?? "" }
      );

      setUsers(normalized);
    } catch (err) {
      console.log("fetchUsers err:", err.response?.data ?? err.message);

      try {
        const fallback = await axios.get(`${BASE}/doctor/userlist`);
        const all = fallback?.data?.users ?? [];
        setUsers([]);
        console.log(
          "Fallback used: doctor/userlist returned",
          all.length,
          "users"
        );
      } catch (e) {
        console.log("fallback failed:", e.response?.data ?? e.message);
        Alert.alert("Error", "Could not fetch users.");
      }
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor.email) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [doctor.email]);

  const loadAllPatients = async () => {
    try {
      setAllPatients([]);
      const res = await axios.get(`${BASE}/doctor/userlist`);
      const arr = res?.data?.users ?? [];

      const patients = arr.filter(
        (u) => (u.role ?? "").toString().toLowerCase() === "patient"
      );

      const normalized = patients.map((u) => ({
        email: u.email ?? u._id ?? "",
        name: u.name ?? u.email ?? "",
      }));

      const assignedEmails = new Set(users.map((x) => x.email));
      const enriched = normalized.map((p) => ({
        ...p,
        alreadyAdded: assignedEmails.has(p.email),
      }));

      setAllPatients(enriched);
    } catch (err) {
      console.log("loadAllPatients err:", err.response?.data ?? err.message);
      Alert.alert("Error", "Could not load patients list.");
    }
  };

  const addSingleUser = async (userEmail) => {
    if (!doctor.email) {
      Alert.alert("Missing doctor", "Doctor email not found. Login again.");
      return;
    }
    if (!userEmail) return;

    if (users.some((u) => u.email === userEmail)) {
      Alert.alert("Already added", "This user is already in your list.");
      return;
    }

    try {
      setAddLoadingEmail(userEmail);

      const res = await axios.post(`${BASE}/doctor/addusers`, {
        email: doctor.email,
        users: [userEmail],
      });

      Alert.alert("Success", res.data?.msg ?? "User added");

      await fetchUsers();
      setAllPatients((prev) =>
        prev.map((p) =>
          p.email === userEmail ? { ...p, alreadyAdded: true } : p
        )
      );
    } catch (err) {
      console.log("addSingleUser err:", err.response?.data ?? err.message);
      Alert.alert("Error", err.response?.data?.msg ?? "Failed to add user.");
    } finally {
      setAddLoadingEmail("");
    }
  };

  const deleteUser = (userEmail) => {
    if (!doctor.email) {
      Alert.alert("Missing doctor", "Doctor email not found. Login again.");
      return;
    }
    if (!userEmail) return;

    Alert.alert(
      "Confirm",
      `Remove ${userEmail} from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleteLoadingEmail(userEmail);
              const res = await axios.post(`${BASE}/doctor/deleteuser`, {
                doctorEmail: doctor.email,
                userEmail,
              });

              Alert.alert("Removed", res.data?.msg ?? "User removed");
              await fetchUsers();
              setAllPatients((prev) =>
                prev.map((p) =>
                  p.email === userEmail ? { ...p, alreadyAdded: false } : p
                )
              );
            } catch (err) {
              console.log("deleteUser err:", err.response?.data ?? err.message);
              Alert.alert(
                "Error",
                err.response?.data?.msg ?? "Failed to remove user"
              );
            } finally {
              setDeleteLoadingEmail("");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ✅ MAIN: Calculate mean + percent
  const calculateRecovery = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return { mean: 0, percent: 0 };
    }

    const mean = arr.reduce((sum, v) => sum + Number(v || 0), 0) / arr.length;

    // ✅ Linear scale between 0.5s (100%) → 6s (0%)
    const percent = ((6 - mean) / (6 - 0.5)) * 100;

    const m = mean;
    const p = Math.max(0, Math.min(100, Math.round(percent)));

    return {
      mean: Number(m.toFixed(1)),
      percent: Number(
        (100 - Number((((m / 1000) * 100) / 6).toFixed(2))).toFixed(2)
      ),
    };
  };

  // ✅ SIMPLE PERCENT FUNCTION (optional)
  const recoveryPercent = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;

    const mean = arr.reduce((sum, v) => sum + Number(v || 0), 0) / arr.length;
    const percent = 100 - Math.min(100, Math.round((mean / 6) * 100));

    return percent < 0 ? 0 : percent;
  };

  const handleViewData = async (user) => {
    if (!user?.email) {
      Alert.alert("Invalid user", "User email missing.");
      return;
    }
    try {
      setSelectedUserForData(user);
      setDataModalVisible(true);
      setDataLoading(true);

      // ✅ FIX: start with array instead of null
      setSelectedUserData([]);

      const res = await axios.post(`${BASE}/user/data`, { email: user.email });

      const arr = res?.data?.dataArr ?? res?.data?.user?.dataArr ?? [];

      // ✅ FIX: ensure array
      setSelectedUserData(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.log("handleViewData err:", err.response?.data ?? err.message);
      Alert.alert("Error", "Could not load user data.");
      setDataModalVisible(false);
    } finally {
      setDataLoading(false);
    }
  };

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
      (item.name || "")
        .split(" ")
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase() || "NA";

    return (
      <View style={styles.patientCard}>
        <View style={[styles.initialCircle, { backgroundColor: "#28AFB0" }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name || item.email}</Text>
          <Text style={styles.patientId}>ID : {item.email}</Text>
          <Text style={[styles.status, { color: "#28AFB0" }]}>Active</Text>
        </View>

        <View style={styles.detailsSection}>
          <TouchableOpacity
            style={[
              styles.detailsButton,
              { backgroundColor: "#4CAF50", marginTop: 6 },
            ]}
            onPress={() => handleViewData(item)}
          >
            <Text style={styles.detailsText}>View Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.detailsButton,
              { backgroundColor: "#E53935", marginTop: 6 },
            ]}
            onPress={() => deleteUser(item.email)}
            disabled={deleteLoadingEmail === item.email}
          >
            {deleteLoadingEmail === item.email ? (
              <ActivityIndicator size="small" color="#FFFDFD" />
            ) : (
              <Text style={styles.detailsText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={fetchUsers}
          style={{
            flex: 1,
            backgroundColor: "#28AFB0",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          {fetchLoading ? (
            <ActivityIndicator size="small" color="#FFFDFD" />
          ) : (
            <Text style={{ color: "#FFFDFD", fontWeight: "bold" }}>
              Get Users
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setAddModalVisible(true);
            loadAllPatients();
          }}
          style={{
            width: 86,
            backgroundColor: "#FFFDFD",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#28AFB0",
          }}
        >
          <Text style={{ color: "#28AFB0", fontWeight: "bold" }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Patients</Text>
      <Text style={styles.sectionSubtitle}>
        Tap a patient to view detailed progress
      </Text>

      {users.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#293132" }}>
            No patients found. Use + Add to assign patients.
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* ADD USERS MODAL */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.modalBox, { maxHeight: "85%" }]}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}
            >
              Select Users to Add
            </Text>

            <ScrollView>
              {allPatients.length === 0 ? (
                <Text>No patients available.</Text>
              ) : (
                allPatients.map((p) => {
                  const already =
                    !!p.alreadyAdded || users.some((u) => u.email === p.email);
                  return (
                    <View
                      key={p.email}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderColor: "#EEE",
                      }}
                    >
                      <View>
                        <Text style={{ fontWeight: "600" }}>{p.name}</Text>
                        <Text style={{ color: "#666", fontSize: 12 }}>
                          {p.email}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => addSingleUser(p.email)}
                        disabled={already || addLoadingEmail === p.email}
                        style={{
                          backgroundColor: already ? "#BDBDBD" : "#28AFB0",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        {addLoadingEmail === p.email ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                            {already ? "Added" : "Add"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setAddModalVisible(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: "#293132", alignSelf: "flex-end" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* VIEW DATA MODAL */}
      <Modal
        visible={dataModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDataModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.modalBox, { maxHeight: "85%" }]}>
            {/* USER INFO */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "#293132" }}
              >
                {selectedUserForData?.name}
              </Text>
              <Text style={{ fontSize: 13, color: "#666" }}>
                {selectedUserForData?.email}
              </Text>
            </View>

            {dataLoading ? (
              <ActivityIndicator size="small" color="#28AFB0" />
            ) : (
              <ScrollView style={{ paddingVertical: 10 }}>
                {/* ✅ BEAUTIFUL SUMMARY CARD */}
                {/* ✅ BEAUTIFUL SEPARATE BIG AVERAGE CARD */}
                {(() => {
                  const { mean, percent } = calculateRecovery(
                    selectedUserData || []
                  );

                  return (
                    <>
                      {/* BIG AVERAGE VALUE CARD */}
                      <View
                        style={{
                          backgroundColor: "#28AFB0",
                          padding: 20,
                          borderRadius: 16,
                          marginBottom: 20,
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOpacity: 0.15,
                          shadowRadius: 6,
                          elevation: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontSize: 16,
                            marginBottom: 6,
                            fontWeight: "600",
                          }}
                        >
                          Average Reaction Time
                        </Text>

                        <Text
                          style={{
                            color: "#FFF",
                            fontSize: 30,
                            fontWeight: "bold",
                            lineHeight: 52,
                          }}
                        >
                          {mean / 1000}s
                        </Text>
                        <Text>Reference of 6s</Text>
                      </View>

                      {/* RECOVERY SCORE CARD */}
                      <View
                        style={{
                          marginBottom: 20,
                          padding: 16,
                          backgroundColor: "#E8F9F9",
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: "#C5EFEF",
                          shadowColor: "#000",
                          shadowOpacity: 0.08,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#28AFB0",
                            marginBottom: 10,
                            textAlign: "center",
                          }}
                        >
                          Recovery Score
                        </Text>

                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#293132",
                            textAlign: "center",
                          }}
                        >
                          {percent}%
                        </Text>

                        <Text
                          style={{
                            fontSize: 12,
                            color: "#555",
                            textAlign: "center",
                            marginTop: 4,
                          }}
                        >
                          Higher score means faster recovery
                        </Text>
                      </View>
                    </>
                  );
                })()}

                {/* ✅ BARCHART */}
                <View
                  style={{
                    marginBottom: 20,
                    backgroundColor: "#FFF",
                    paddingVertical: 12,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      marginBottom: 4,
                      fontWeight: "bold",
                      color: "#293132",
                      textAlign: "center",
                    }}
                  >
                    Reaction Time Graph
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: "#555",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Lower values = Faster and better performance
                  </Text>

                  <BarChart
                    data={{
                      labels: (selectedUserData || []).map(
                        (_, i) => `S${i + 1}`
                      ),
                      datasets: [{ data: selectedUserData || [] }],
                    }}
                    width={Dimensions.get("window").width - 80}
                    height={240}
                    fromZero={true}
                    yAxisSuffix="s"
                    chartConfig={{
                      backgroundGradientFrom: "#FFFDFD",
                      backgroundGradientTo: "#FFFDFD",
                      decimalPlaces: 2,
                      color: (opacity) => `rgba(40,175,176,${opacity})`,
                      labelColor: (opacity) => `rgba(41,49,50,${opacity})`,
                      propsForBackgroundLines: { stroke: "#E0E0E0" },
                    }}
                    style={{ borderRadius: 10, alignSelf: "center" }}
                  />

                  <Text
                    style={{
                      marginTop: 8,
                      color: "#28AFB0",
                      fontSize: 12,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    ✅ Aim to reduce reaction time over sessions
                  </Text>
                </View>
              </ScrollView>
            )}

            {/* CLOSE BUTTON */}
            <TouchableOpacity
              onPress={() => setDataModalVisible(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: "#293132", alignSelf: "flex-end" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#293132",
  },
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
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#FFFDFD",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
});
