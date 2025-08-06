// app/_layout.tsx - Root Layout with AuthProvider
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cbtApp" />
        <Stack.Screen name="register" />
      </Stack>
    </AuthProvider>
  );
}
