import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, Alex!</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        {/* AVERAGE REFLEX TIME CARD */}
        <View style={styles.reflexCard}>
          <View>
            <Text style={styles.cardTitle}>Average Reflex Time</Text>
            <Text style={styles.reflexValue}>180 ms</Text>
          </View>
          <View style={styles.circleContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Text style={styles.percentText}>70%</Text>
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

          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Yesterday: 175 ms</Text>
            <View style={styles.dot} />
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Mon, Oct 23: 182 ms</Text>
            <View style={styles.dot} />
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Sun, Oct 22: 190 ms</Text>
            <View style={styles.dot} />
          </View>
        </View>

        {/* GO TO DASHBOARD LINK */}
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.dashboardLink}>Go to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafa",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* REFLEX CARD */
  reflexCard: {
    backgroundColor: "#28afb0",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  reflexValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
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
  percentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#28afb0",
  },

  /* START BUTTON */
  startButton: {
    backgroundColor: "#28afb0",
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* HISTORY */
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyText: {
    color: "#333",
    fontSize: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#28afb0",
  },

  /* LINK */
  dashboardLink: {
    textAlign: "center",
    color: "#28afb0",
    marginTop: 25,
    fontWeight: "500",
    fontSize: 15,
  },
});
