import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//////////////// ✅ FIREBASE COMPAT IMPORTS (Works in React Native) ////////////////
import firebase from "firebase/compat/app";
import "firebase/compat/database";
///////////////////////////////////////////////////////////////////////////////////

const screenWidth = Dimensions.get("window").width - 40;

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Firebase Reaction Data (Chart)
  const [reactionLabels, setReactionLabels] = useState([]);
  const [reactionValues, setReactionValues] = useState([]);

  ////////////////////// ✅ FIREBASE CONFIG ////////////////////////
  const firebaseConfig = {
    apiKey: "AIzaSyBk5t9Qd9aXehaZzPXZYSORZI-MmndEZhU",
    authDomain: "NeuroFlexMat.firebaseapp.com",
    databaseURL:
      "https://neuroflexmat-237e7-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "neuroflexmat-237e7",
    storageBucket: "neuroflexmat-237e7.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
  };

  // ✅ Initialize Firebase App only once
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  /////////////////////////////////////////////////////////////////

  // ✅ Fetch Reaction Logs from Firebase
  const fetchReactionLogs = async () => {
    try {
      const snapshot = await db.ref("reactionLogs/node1").once("value");

      if (snapshot.exists()) {
        const rawData = snapshot.val();

        // Convert object into array
        const entries = Object.keys(rawData).map((key) => ({
          reaction: rawData[key].reaction_time_ms,
          timestamp: rawData[key].timestamp,
        }));

        // ✅ Chart Data
        const labels = entries.map((e) => String(e.reaction)); // show ms on X-axis
        const values = entries.map((e) => Number(e.reaction)); // values in ms

        setReactionLabels(labels);
        setReactionValues(values);

        console.log("✅ Firebase Reaction Data:", entries);
      }
    } catch (error) {
      console.log("🔥 Firebase Fetch Error:", error);
    }
  };

  // ✅ Load saved user
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsed = JSON.parse(data);

        setUser({
          name: parsed.name,
          email: parsed.email,
          age: parsed.age,
          role: parsed.role,
          recovery: parsed.recovery || 78,
          sessions: parsed.sessions || 24,
          compliance: parsed.compliance || 92,
        });
      }
    } catch (error) {
      console.log("User load error:", error);
    }
  };

  useEffect(() => {
    loadUser();
    fetchReactionLogs();
  }, []);

  // ✅ User Stats Section
  const stats = [
    {
      label: "Recovery",
      value: `${user?.recovery || 78}%`,
      icon: "heart-pulse",
      colors: ["#28AFB0", "#28AFB0"],
    },
    {
      label: "Sessions",
      value: user?.sessions || 24,
      icon: "calendar-check",
      colors: ["#28AFB0", "#28AFB0"],
    },
    {
      label: "Compliance",
      value: `${user?.compliance || 92}%`,
      icon: "check-circle",
      colors: ["#28AFB0", "#28AFB0"],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.name}>{user?.name || "Loading..."}</Text>
            <Text style={styles.id}>Email: {user?.email || "N/A"}</Text>
            <Text style={styles.id}>Age: {user?.age || "N/A"}</Text>
            <Text style={styles.id}>Role: {user?.role || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              { backgroundColor: stat.colors[1] + "20" },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: stat.colors[0] + "33" },
              ]}
            >
              <MaterialCommunityIcons
                name={stat.icon}
                size={28}
                color={stat.colors[1]}
              />
            </View>

            <Text style={[styles.statValue, { color: stat.colors[1] }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* ✅ Firebase Reaction Chart */}
      <Text style={styles.sectionTitle}>Reaction Time (ms)</Text>

      {reactionValues.length > 0 ? (
        <BarChart
          data={{
            labels: reactionLabels,
            datasets: [{ data: reactionValues }],
          }}
          width={screenWidth}
          height={240}
          yAxisSuffix="ms"
          chartConfig={{
            backgroundGradientFrom: "#FFFDFD",
            backgroundGradientTo: "#FFFDFD",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(40, 175, 176, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(41, 49, 50, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={styles.chart}
        />
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "#293132",
          }}
        >
          Loading Firebase Data...
        </Text>
      )}

      {/* Overall Progress */}
      <Text style={styles.sectionTitle}>Overall Recovery</Text>

      <Progress.Bar
        progress={(user?.recovery || 78) / 100}
        width={screenWidth}
        height={15}
        borderRadius={10}
        color="#28AFB0"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        style={{ marginBottom: 30 }}
      />
    </ScrollView>
  );
}

//////////////////////// ✅ STYLES (unchanged) ////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDFD" },

  header: {
    backgroundColor: "#28AFB0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: 40,
    elevation: 3,
  },
  headerContent: { flexDirection: "row", alignItems: "center" },

  name: { color: "#FFFDFD", fontSize: 24, fontWeight: "700" },
  id: { color: "#FFFDFD", fontSize: 14, fontWeight: "500", marginTop: 4 },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 5,
    backgroundColor: "#FFFDFD",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 4,
  },

  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },

  statValue: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  statLabel: { fontSize: 13, color: "#293132", fontWeight: "500" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 12,
    color: "#293132",
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
  },
});
