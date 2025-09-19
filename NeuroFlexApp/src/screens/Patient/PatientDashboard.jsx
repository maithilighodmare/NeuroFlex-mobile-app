import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function PatientDashboard() {
  const [filter, setFilter] = useState("Weekly");

  // Dummy data for different filters
  const chartData = {
    Daily: {
      labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
      datasets: [
        { data: [500, 1200, 800, 1500, 1000, 700], color: () => "#2A4D9B" }, // Steps
        { data: [50, 120, 80, 150, 100, 70], color: () => "#FF9900" }, // Calories
      ],
      legend: ["Steps", "Calories Burned"],
    },
    Weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [2000, 7500, 6000, 5000, 8000, 6500, 7000],
          color: () => "#2A4D9B",
        },
        { data: [120, 300, 280, 260, 400, 350, 380], color: () => "#FF9900" },
      ],
      legend: ["Steps", "Calories Burned"],
    },
    Monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        { data: [15000, 20000, 18000, 22000], color: () => "#2A4D9B" },
        { data: [1200, 1500, 1400, 1600], color: () => "#FF9900" },
      ],
      legend: ["Steps", "Calories Burned"],
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient Dashboard</Text>
        <Ionicons name="notifications-outline" size={24} color="#2A4D9B" />
      </View>

      {/* Weekly Goal */}
      <View style={styles.card}>
        <Text style={styles.goalText}>Weekly Goal</Text>
        <Text style={styles.subText}>
          You’re 80% close to your weekly goal—keep pushing!
        </Text>
        <ProgressBar
          progress={0.8}
          color="#2A4D9B"
          style={styles.progressBar}
        />
        <Text style={styles.progressLabel}>Overall Recovery Progress 80%</Text>
      </View>

      {/* Types of Exercises */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types of Exercises</Text>
        <View style={styles.exerciseRow}>
          <View style={styles.exerciseCard}>
            <Ionicons name="heart-outline" size={28} color="#2A4D9B" />
            <Text style={styles.exerciseTitle}>Balance</Text>
            <Text style={styles.exerciseText}>
              Improve stability and prevent falls.
            </Text>
          </View>
          <View style={styles.exerciseCard}>
            <Ionicons name="barbell-outline" size={28} color="#2A4D9B" />
            <Text style={styles.exerciseTitle}>Strength</Text>
            <Text style={styles.exerciseText}>
              Build muscle and increase endurance.
            </Text>
          </View>
        </View>
      </View>

      {/* Pending Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Tasks</Text>

        <View style={styles.taskCard}>
          <Ionicons name="calendar-outline" size={24} color="#2A4D9B" />
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Neuroflex Mat Session</Text>
            <Text style={styles.taskSubtitle}>
              Today, 2:00 PM - Physiotherapy
            </Text>
          </View>
          <Text style={styles.taskStatusDue}>Due Today</Text>
        </View>

        <View style={styles.taskCard}>
          <Ionicons name="clipboard-outline" size={24} color="#2A4D9B" />
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Weekly Health Survey</Text>
            <Text style={styles.taskSubtitle}>
              Complete by Friday - Data Entry
            </Text>
          </View>
          <Text style={styles.taskStatusPending}>Pending</Text>
        </View>

        <View style={styles.taskCard}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#2A4D9B" />
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Doctor Feedback Review</Text>
            <Text style={styles.taskSubtitle}>
              Scheduled for tomorrow - Teleconsult
            </Text>
          </View>
          <Text style={styles.taskStatusUpcoming}>Upcoming</Text>
        </View>
      </View>

      {/* Activity Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Progress</Text>

        {/* Filter buttons */}
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
        </View>

        {/* Line Chart */}
        <LineChart
          data={chartData[filter]}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(42, 77, 155, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#2A4D9B",
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2A4D9B" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  goalText: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  subText: { fontSize: 14, color: "gray", marginBottom: 10 },
  progressBar: { height: 10, borderRadius: 5 },
  progressLabel: { fontSize: 12, color: "gray", marginTop: 6 },

  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  exerciseRow: { flexDirection: "row", justifyContent: "space-between" },
  exerciseCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginRight: 10,
    elevation: 2,
  },
  exerciseTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  exerciseText: { fontSize: 12, color: "gray", marginTop: 4 },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  taskInfo: { flex: 1, marginLeft: 10 },
  taskTitle: { fontSize: 15, fontWeight: "bold" },
  taskSubtitle: { fontSize: 12, color: "gray" },

  taskStatusDue: {
    color: "#FF4C4C",
    fontSize: 12,
    fontWeight: "bold",
  },
  taskStatusPending: {
    color: "#FF9900",
    fontSize: 12,
    fontWeight: "bold",
  },
  taskStatusUpcoming: {
    color: "#2A4D9B",
    fontSize: 12,
    fontWeight: "bold",
  },

  filterRow: { flexDirection: "row", marginBottom: 10 },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  filterBtnActive: { backgroundColor: "#2A4D9B", borderColor: "#2A4D9B" },
  filterText: { color: "gray", fontSize: 14 },
  filterTextActive: { color: "#fff", fontWeight: "bold" },

  chart: { borderRadius: 12, marginTop: 8 },
});
