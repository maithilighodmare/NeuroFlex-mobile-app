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
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

export default function PatientDashboard() {
  const [filter, setFilter] = useState("Weekly");
  const [category, setCategory] = useState("Overall");

  // Dummy data for different filters
  const chartData = {
    Daily: {
      Hand: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ data: [320, 310, 305, 300, 295, 290, 285] }],
        legend: ["Reflex Time (Hand, ms)"],
      },
      Leg: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ data: [450, 440, 430, 420, 410, 400, 390] }],
        legend: ["Reflex Time (Leg, ms)"],
      },
      Overall: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ data: [385, 375, 370, 360, 350, 345, 340] }],
        legend: ["Reflex Time (Overall, ms)"],
      },
    },
    Weekly: {
      Hand: {
        labels: ["W1", "W2", "W3", "W4"],
        datasets: [{ data: [310, 300, 290, 280] }],
        legend: ["Reflex Time (Hand, ms)"],
      },
      Leg: {
        labels: ["W1", "W2", "W3", "W4"],
        datasets: [{ data: [440, 420, 400, 380] }],
        legend: ["Reflex Time (Leg, ms)"],
      },
      Overall: {
        labels: ["W1", "W2", "W3", "W4"],
        datasets: [{ data: [375, 360, 345, 330] }],
        legend: ["Reflex Time (Overall, ms)"],
      },
    },
    Monthly: {
      Hand: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{ data: [300, 290, 280, 270] }],
        legend: ["Reflex Time (Hand, ms)"],
      },
      Leg: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{ data: [420, 410, 390, 370] }],
        legend: ["Reflex Time (Leg, ms)"],
      },
      Overall: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{ data: [365, 350, 335, 320] }],
        legend: ["Reflex Time (Overall, ms)"],
      },
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient Dashboard</Text>
        <Ionicons name="notifications-outline" size={24} color="#2A4D9B" />
      </View>
      {/* Activity Progress */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Activity Progress</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(value) => setCategory(value)}
            >
              <Picker.Item label="Overall" value="Overall" />
              <Picker.Item label="Hand" value="Hand" />
              <Picker.Item label="Leg" value="Leg" />
            </Picker>
          </View>
        </View>

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
          data={chartData[filter][category]}
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
    marginTop: 50,
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
  dropdown: {
    height: 40,
    width: 130,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },

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
