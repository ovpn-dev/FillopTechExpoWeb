import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import apiService, { TokenStorage } from "../app/services/apiService";

export default function TestAuth() {
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<"student" | "corporate">("student");
  const [user, setUser] = useState<any>(null);

  const handleRegister = async () => {
    try {
      const res = await apiService.register({
        username,
        email,
        password,
        role,
      });
      await TokenStorage.setToken(res.token);
      Alert.alert("Register Success", `User: ${res.user.username}`);
      setUser(res.user);
    } catch (err: any) {
      console.error("Register error:", err);
      Alert.alert("Error", err.message || "Register failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await apiService.login({ email, password });
      await TokenStorage.setToken(res.token);
      Alert.alert("Login Success", `Token: ${res.token.substring(0, 20)}...`);

      const me = await apiService.getMe();
      setUser(me);
      Alert.alert("User Info", JSON.stringify(me, null, 2));
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Error", err.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await TokenStorage.removeToken();
    setUser(null);
    Alert.alert("Logged out");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button title="Register" onPress={handleRegister} />
      <View style={{ height: 10 }} />
      <Button title="Login & Get Me" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="Logout" onPress={handleLogout} color="red" />

      {user && (
        <View style={{ marginTop: 20 }}>
          <Text>Current User:</Text>
          <Text>{JSON.stringify(user, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}
