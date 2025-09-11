import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiService, { TokenStorage } from "../services/apiService";

export default function TestAuth() {
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [address, setAddress] = useState("123 Main St");
  const [stateVal, setStateVal] = useState("Lagos");
  const [lga, setLga] = useState("Ikeja");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!email.includes("@") || password.length < 6) {
      Alert.alert("Invalid Input", "Check email and password (min 6 chars).");
      return false;
    }
    if (!firstName || !lastName || !address || !stateVal || !lga) {
      Alert.alert("Missing fields", "Fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const res = await apiService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        address,
        state: stateVal,
        LGA: lga,
      });
      await TokenStorage.setToken(res.token);
      Alert.alert("Register Success", `User registered successfully`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.login({ email, password });
      await TokenStorage.setToken(res.token);
      Alert.alert("Login Success", `Token stored.`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMe = async () => {
    setIsLoading(true);
    try {
      const me = await apiService.getMe();
      setUser(me);
      Alert.alert("User Info", JSON.stringify(me, null, 2));
    } catch (err: any) {
      Alert.alert("Error", err.message || "GetMe failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await TokenStorage.removeToken();
    setUser(null);
    Alert.alert("Logged out");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text>First Name:</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text>Last Name:</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text>Address:</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <Text>State:</Text>
      <TextInput
        value={stateVal}
        onChangeText={setStateVal}
        style={styles.input}
      />

      <Text>LGA:</Text>
      <TextInput value={lga} onChangeText={setLga} style={styles.input} />

      <TouchableOpacity
        onPress={handleRegister}
        disabled={isLoading}
        style={[styles.btn, { backgroundColor: "green" }]}
      >
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={[styles.btn, { backgroundColor: "blue" }]}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGetMe}
        disabled={isLoading}
        style={[styles.btn, { backgroundColor: "orange" }]}
      >
        <Text style={styles.btnText}>Get Me</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.btn, { backgroundColor: "red" }]}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>

      {user && (
        <View style={{ marginTop: 20 }}>
          <Text>Current User:</Text>
          <Text>{JSON.stringify(user, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  input: { borderWidth: 1, marginBottom: 10, padding: 5 },
  btn: { padding: 10, marginBottom: 10 },
  btnText: { color: "white", textAlign: "center" },
};
