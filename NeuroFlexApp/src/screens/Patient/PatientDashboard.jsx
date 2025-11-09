import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import axios from "axios";

const screenWidth = Dimensions.get("window").width - 40;

export default function PatientDashboard() {
  const [user, setUser] = useState(null);

  const [firebaseMean, setFirebaseMean] = useState(0);
  const [dataArr, setDataArr] = useState([]);
  const [averageValue, setAverageValue] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

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

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  const db = firebase.database();

  // ✅ Compute mean from 5 Firebase nodes
  const computeMeanFromAllNodes = async () => {
    try {
      const snaps = await Promise.all([
        db.ref("reactionLogs/node1").once("value"),
        db.ref("reactionLogs/node2").once("value"),
        db.ref("reactionLogs/node3").once("value"),
        db.ref("reactionLogs/node4").once("value"),
        db.ref("reactionLogs/node5").once("value"),
      ]);

      const allValues = [];

      snaps.forEach((snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          Object.keys(raw).forEach((key) => {
            const v = raw[key]?.reaction_time_ms;
            if (v !== undefined && !isNaN(Number(v))) {
              allValues.push(Number(v) / 1000); // convert ms → seconds
            }
          });
        }
      });

      const mean =
        allValues.length > 0
          ? allValues.reduce((sum, x) => sum + x, 0) / allValues.length
          : 0;

      setFirebaseMean(Number(mean.toFixed(3)));
      return Number(mean.toFixed(3));
    } catch (err) {
      console.log("Error computing Firebase mean:", err);
      return 0;
    }
  };

  // ✅ Load user + sessions
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed);

        const res = await axios.post("http://192.168.213.204:4000/user/data", {
          email: parsed.email,
        });

        // ✅ convert ms → seconds
        const valuesInSeconds = (res.data.dataArr || []).map((v) =>
          Number((v / 1000).toFixed(3))
        );

        setDataArr(valuesInSeconds);

        if (valuesInSeconds.length > 0) {
          const avg =
            valuesInSeconds.reduce((s, x) => s + x, 0) / valuesInSeconds.length;

          setAverageValue(Number(avg.toFixed(3)));
        } else {
          setAverageValue(0);
        }
      }
    } catch (err) {
      console.log("User load error:", err);
    }
  };

  useEffect(() => {
    loadUser();
    computeMeanFromAllNodes();
  }, []);

  // ✅ Timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else clearInterval(interval);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startExercise = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  const stopExercise = async () => {
    setIsRunning(false);

    try {
      const finalValue = await computeMeanFromAllNodes(); // seconds

      const randomValueSec = Math.floor(Math.random() * 801 + 100) / 1000;

      await axios.post("http://192.168.213.204:4000/user/addvalue", {
        email: user.email,
        value: finalValue, // convert sec→ms
      });

      await loadUser();
    } catch (err) {
      console.log("Error stopExercise:", err);
    }
  };

  // ✅ Correct inverted recovery percent
  const recoveryPercent = () => {
    if (!dataArr.length) return 0;

    const mean = dataArr.reduce((s, x) => s + x, 0) / dataArr.length; // seconds

    // ✅ 0.5s → ~100%
    // ✅ 6s → 0%
    const percent = 100 - Math.min(100, Math.round((mean / 6) * 100));

    return percent < 0 ? 0.0 : percent;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.id}>Email: {user?.email}</Text>
            <Text style={styles.id}>Age: {user?.age}</Text>
            <Text style={styles.id}>Role: {user?.role}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recoveryPercent()}%</Text>
          <Text style={styles.statLabel}>Recovery</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dataArr.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>

        {/* <View style={styles.statCard}>
          <Text style={styles.statValue}>86%</Text>
          <Text style={styles.statLabel}>Compliance</Text>
        </View> */}
      </View>

      {/* Timer */}
      {isRunning && (
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>Timer: {seconds}s</Text>
        </View>
      )}

      {!isRunning ? (
        <TouchableOpacity style={styles.startButton} onPress={startExercise}>
          <Text style={styles.buttonText}>Start Exercise</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={stopExercise}>
          <Text style={styles.buttonText}>End Exercise</Text>
        </TouchableOpacity>
      )}

      {/* Average */}
      <View style={styles.averageCard}>
        <Text style={styles.averageLabel}>Average Session</Text>
        <Text style={styles.averageValue}>{averageValue}s</Text>
        <Text style={styles.averageRef}>(Reference: 6s)</Text>
      </View>

      {/* Chart */}
      {/* -------- ✅ Session Performance Chart -------- */}
      <Text style={styles.sectionTitle}>Session Performance Trend</Text>

      {dataArr.length > 0 ? (
        <View>
          <Text style={styles.chartSubtitle}>
            Each bar represents the reaction time (in seconds) for a session.
            Lower values = Faster response = Better performance.
          </Text>

          <BarChart
            data={{
              labels: dataArr.map((_, i) => `S${i + 1}`),
              datasets: [{ data: dataArr }],
            }}
            width={screenWidth}
            height={260}
            fromZero={true}
            yAxisSuffix="s"
            chartConfig={{
              backgroundGradientFrom: "#FFFDFD",
              backgroundGradientTo: "#FFFDFD",
              decimalPlaces: 2,
              color: (opacity) => `rgba(40,175,176,${opacity})`,
              labelColor: (opacity) => `rgba(41,49,50,${opacity})`,
              propsForBackgroundLines: {
                stroke: "#E0E0E0",
              },
            }}
            style={styles.chart}
          />

          <Text style={styles.chartNote}>
            ✅ Tip: Aim for lower values over time to improve your recovery and
            reaction speed.
          </Text>
        </View>
      ) : (
        <Text style={styles.noData}>No session data yet...</Text>
      )}

      {/* Recovery Progress */}
      <Text style={styles.sectionTitle}>Overall Recovery</Text>
      <Progress.Bar
        progress={recoveryPercent() / 100}
        width={screenWidth}
        height={15}
        color="#28AFB0"
        borderWidth={0}
        borderRadius={10}
        unfilledColor="#E0E0E0"
        style={{ marginBottom: 25 }}
      />
    </ScrollView>
  );
}

//////////////////// STYLES ////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDFD" },

  header: {
    backgroundColor: "#28AFB0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: 40,
  },
  headerContent: { flexDirection: "row", alignItems: "center" },
  name: { color: "#FFFDFD", fontSize: 24, fontWeight: "700" },
  id: { color: "#FFFDFD", fontSize: 14, marginTop: 4 },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#28AFB020",
    marginHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#28AFB0" },
  statLabel: { fontSize: 13, color: "#293132" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 10,
    color: "#293132",
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },

  startButton: {
    backgroundColor: "#28AFB0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  averageCard: {
    backgroundColor: "#28AFB020",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  averageLabel: {
    fontSize: 14,
    color: "#293132",
    marginBottom: 5,
    fontWeight: "500",
  },
  averageValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#28AFB0",
  },
  averageRef: {
    fontSize: 12,
    color: "#555",
    marginTop: 3,
  },

  startButton: {
    backgroundColor: "#28AFB0",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  stopButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  timerCard: {
    backgroundColor: "#28AFB020",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#28AFB0",
  },
  timerText: {
    fontSize: 20,
    color: "#28AFB0",
    fontWeight: "600",
  },

  chartSubtitle: {
  textAlign: "center",
  color: "#555",
  fontSize: 13,
  marginBottom: 10,
  paddingHorizontal: 10,
},

chartNote: {
  textAlign: "center",
  color: "#28AFB0",
  fontSize: 13,
  marginTop: 10,
  fontWeight: "500",
},

noData: {
  textAlign: "center",
  marginTop: 20,
  color: "#293132",
  fontSize: 14,
},

});
