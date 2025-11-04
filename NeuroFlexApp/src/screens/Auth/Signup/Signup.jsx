// Signup.js
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import axios from "axios";

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("Patient");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // ✅ NEW

  const handleSignup = async () => {
    if (!name || !email || !password || !age)
      return Alert.alert("Error", "All fields required");

    setLoading(true);

    try {
      const apiRole = role === "Patient" ? "user" : "doctor";

      const res = await axios.post(
        `https://neuro-flex-mat-backend-hmxu.vercel.app/${apiRole}/signup`,
        { name, email, password, age, role }
      );

      const user = apiRole === "user" ? res.data.newUser : res.data.newDoctor;

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        dataArr: user.dataArr || [],
      };

      await AsyncStorage.setItem("data", JSON.stringify(userData));

      // ✅ Beautiful success message
      Alert.alert(
        "✅ Account Created!",
        "Your registration was successful.\nWelcome aboard!",
        [{ text: "Continue", onPress: () => navigation.replace(role === "Doctor" ? "Doctor" : "Patient") }]
      );

    } catch (err) {
      Alert.alert("Signup Failed", err.response?.data?.message || "Try again");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Begin your path to smarter healthcare</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={role} onValueChange={setRole}>
          <Picker.Item label="Patient" value="Patient" />
          <Picker.Item label="Doctor" value="Doctor" />
        </Picker>
      </View>

      {/* ✅ Password Input + Eye Toggle */}
      <View style={{ position: "relative" }}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 15,
            top: 18,
          }}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="#DB4437" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#3b5998" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Your styles (unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007B83",
    marginBottom: 25,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  primaryButton: {
    backgroundColor: "#0097A7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
    color: "#666",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    justifyContent: "center",
  },
  socialText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    color: "#007BFF",
    fontSize: 15,
    textAlign: "center",
  },
});
