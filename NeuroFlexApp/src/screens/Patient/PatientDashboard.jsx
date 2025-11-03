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

const screenWidth = Dimensions.get("window").width - 40;

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("Weekly");
  const [category, setCategory] = useState("Overall");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Load updated user from AsyncStorage (same as profile)
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsed = JSON.parse(data);

        setUser({
          name: parsed.name || "",
          email: parsed.email || "",
          age: parsed.age || "",
          role: parsed.role || "",
          recovery: parsed.recovery || 78,
          sessions: parsed.sessions || 24,
          compliance: parsed.compliance || 92,
        });
      }
    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Default chart data
  const chartData = {
    Daily: {
      Hand: [320, 310, 305, 300, 295, 290, 285],
      Leg: [450, 440, 430, 420, 410, 400, 390],
      Overall: [385, 375, 370, 360, 350, 345, 340],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    Weekly: {
      Hand: [310, 300, 290, 280],
      Leg: [440, 420, 400, 380],
      Overall: [375, 360, 345, 330],
      labels: ["W1", "W2", "W3", "W4"],
    },
    Monthly: {
      Hand: [300, 290, 280, 270],
      Leg: [420, 410, 390, 370],
      Overall: [365, 350, 335, 320],
      labels: ["Jan", "Feb", "Mar", "Apr"],
    },
  };

  const categories = ["Overall", "Hand", "Leg"];

  // ✅ Stats (now fully synced from updated AsyncStorage)
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

      {/* ✅ Header updated with all user fields */}
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

      {/* Stats Section */}
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

      {/* Filters */}
      <View style={styles.filterRow}>
        {["Daily", "Weekly", "Monthly"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterBtn,
              filter === item && styles.filterBtnActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.dropdownBtn}
          onPress={() => setDropdownOpen(true)}
        >
          <Text style={styles.dropdownText}>{category}</Text>
        </TouchableOpacity>

        <Modal transparent visible={dropdownOpen} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownOpen(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.modalText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Chart */}
      <Text style={styles.sectionTitle}>Recovery Progress</Text>
      <BarChart
        data={{
          labels: chartData[filter].labels,
          datasets: [{ data: chartData[filter][category] }],
        }}
        width={screenWidth}
        height={220}
        yAxisSuffix="ms"
        chartConfig={{
          backgroundGradientFrom: "#FFFDFD",
          backgroundGradientTo: "#FFFDFD",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(40, 175, 176, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(41, 49, 50, ${opacity})`,
          barPercentage: 0.6,
        }}
        style={styles.chart}
      />

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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#293132",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 12,
    color: "#293132",
  },
  chart: { marginVertical: 8, borderRadius: 16, elevation: 2 },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  filterBtnActive: {
    backgroundColor: "#28AFB0",
    borderColor: "#28AFB0",
  },
  filterText: { color: "#293132", fontSize: 14 },
  filterTextActive: { color: "#FFFDFD", fontWeight: "bold" },

  dropdownBtn: {
    backgroundColor: "#FFFDFD",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: "auto",
  },
  dropdownText: { fontSize: 14, fontWeight: "bold", color: "#293132" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFDFD",
    borderRadius: 12,
    width: 200,
    paddingVertical: 10,
  },
  modalItem: { paddingVertical: 10, paddingHorizontal: 20 },
  modalText: { fontSize: 14, color: "#293132" },
});
