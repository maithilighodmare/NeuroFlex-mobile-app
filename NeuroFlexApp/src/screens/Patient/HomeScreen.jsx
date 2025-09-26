import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function App() {
  const services = [
    {
      title: "Orthopedic Therapy",
      desc: "Treatment for bone, joint, and muscle injuries to restore function.",
      icon: "🦴",
    },
    {
      title: "Neurological Rehab",
      desc: "Specialized care for stroke, spinal cord injuries, and conditions.",
      icon: "🧠",
    },
    {
      title: "Sports Therapy",
      desc: "Treatment & prevention of sports injuries and performance boost.",
      icon: "⚽",
    },
    {
      title: "Wellness Programs",
      desc: "Long-term wellness & strength through holistic physiotherapy.",
      icon: "💪",
    },
  ];

  const whyChoose = [
    { title: "500+", desc: "Patients Treated" },
    { title: "95%", desc: "Success Rate" },
    { title: "10+", desc: "Years Experience" },
    { title: "24/7", desc: "Support Available" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ScrollView style={styles.container}>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Expert Physiotherapy Care</Text>
          <Text style={styles.heroSubtitle}>
            Enhance rehabilitation, improve reflexes with smart technology.
          </Text>
        </View>

        {/* OUR SERVICES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.services}>
            {services.map((s, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.icon}>{s.icon}</Text>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardText}>{s.desc}</Text>
              </View>
            ))}
          </View>

          {/* BIGGER BUTTONS AFTER SERVICES */}
          <View style={styles.serviceButtons}>
            <TouchableOpacity
              style={styles.largeBtn}
              onPress={() => alert("Go to Dashboard clicked!")}
            >
              <Text style={styles.largeBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeBtn, { backgroundColor: "#f06dd3ff" }]}
              onPress={() => alert("FAQ clicked!")}
            >
              <Text style={styles.largeBtnText}>FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WHY CHOOSE US */}
        <View style={[styles.section, { backgroundColor: "#eef2ff" }]}>
          <Text style={styles.sectionTitle}>Why Choose NeuroFlex?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.whyContainer}
          >
            {whyChoose.map((item, i) => (
              <View key={i} style={styles.whyCard}>
                <Text style={styles.whyNumber}>{item.title}</Text>
                <Text style={styles.whyText}>{item.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* HERO */
  hero: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#6728f8cc",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    lineHeight: 22,
  },

  /* SECTIONS */
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  /* SERVICES */
  services: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    padding: 8, // smaller insights
    borderRadius: 10,
    width: "44%", // slightly smaller
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  cardText: { fontSize: 11, color: "#6b7280", textAlign: "center" },

  /* BIGGER BUTTONS AFTER SERVICES */
  serviceButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 12,
  },
  largeBtn: {
    backgroundColor: "#f06dd3ff",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  largeBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  /* WHY CHOOSE */
  whyContainer: { paddingVertical: 10 },
  whyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    marginRight: 14,
    alignItems: "center",
    width: 140,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  whyNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f06dd3ff",
    marginBottom: 4,
  },
  whyText: { fontSize: 12, textAlign: "center", color: "#374151" },
});
