import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [averageReflex, setAverageReflex] = useState(0);
  const [percent, setPercent] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);

  // ✅ Function to load updated data
const loadUserData = async () => {
  try {
    const stored = await AsyncStorage.getItem("data");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    // ✅ Fetch updated session data from backend
    const res = await axios.post(
      "http://192.168.213.204:4000/user/data",
      { email: parsed.email }
    );

    const sessions = res.data.dataArr || [];

    if (sessions.length > 0) {
      const numericSessions = sessions.map((v) => Number(v)); // ms

      // ✅ Compute mean in ms
      const sum = numericSessions.reduce((a, b) => a + b, 0);
      const mean = sum / numericSessions.length;

      // ✅ Display average in seconds
      setAverageReflex(Number((mean / 1000).toFixed(2)));

      // ✅ EXACT SAME FORMULA AS DASHBOARD
      const recovery = Math.max(
        0,
        Math.min(
          100,
          Math.round(((6000 - mean) / 6000) * 100)
        )
      );

      setPercent(recovery);

      // ✅ Recent 3
      setRecentHistory(numericSessions.slice(-3).reverse());
    }
  } catch (err) {
    console.log("DATA LOAD ERROR:", err.message);
  }
};


  // ✅ Auto load on start
  useEffect(() => {
    loadUserData();
  }, []);

  // ✅ Refresh Button Function
  const refreshData = async () => {
    console.log("Refreshing data...");
    await loadUserData();
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {user?.name ? `Hi, ${user.name}!` : "Hi, User!"}
          </Text>

          {/* ✅ Refresh + Profile */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            
            {/* ✅ Refresh Button */}
            <TouchableOpacity style={styles.refreshBtn} onPress={refreshData}>
              <Text style={{ color: "#28afb0", fontWeight: "700", fontSize: 16 }}>
                ⟳
              </Text>
            </TouchableOpacity>

            {/* Profile Button */}
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{
                  uri:
                    user?.image ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* AVERAGE REFLEX TIME */}
        <View style={styles.reflexCard}>
          <View>
            <Text style={styles.cardTitle}>Average Reflex Time</Text>
            <Text style={styles.reflexValue}>{averageReflex} sec</Text>
          </View>

          {/* ✅ Recovery % Circle */}
          <View style={styles.circleContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Text style={styles.percentText}>{percent}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* START BUTTON */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.startButtonText}>Start Reflex Test</Text>
        </TouchableOpacity>

        {/* RECENT HISTORY */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Recent History</Text>

          {recentHistory.length > 0 ? (
            recentHistory.map((value, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  Session {recentHistory.length - index}: {value} ms
                </Text>
                <View style={styles.dot} />
              </View>
            ))
          ) : (
            <Text style={styles.historyText}>No history yet</Text>
          )}
        </View>

        {/* GO TO DASHBOARD */}
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.dashboardLink}>Go to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafa" },
  scrollContainer: { padding: 20, paddingBottom: 40, marginTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: { fontSize: 20, fontWeight: "600", color: "#222" },
  profilePic: { width: 40, height: 40, borderRadius: 20 },

  /* ✅ Refresh Button */
  refreshBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#28afb0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },

  reflexCard: {
    backgroundColor: "#28afb0",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "500", marginBottom: 6 },
  reflexValue: { color: "#fff", fontSize: 28, fontWeight: "bold" },

  circleContainer: { alignItems: "center", justifyContent: "center" },
  outerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#b2e2e3",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: { fontSize: 14, fontWeight: "600", color: "#28afb0" },

  startButton: {
    backgroundColor: "#28afb0",
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 25,
    alignItems: "center",
    elevation: 2,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 25,
    elevation: 2,
  },
  historyTitle: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 12 },

  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyText: { color: "#333", fontSize: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#28afb0" },

  dashboardLink: {
    textAlign: "center",
    color: "#28afb0",
    marginTop: 25,
    fontWeight: "500",
    fontSize: 15,
  },
});
