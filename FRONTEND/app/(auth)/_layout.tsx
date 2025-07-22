import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

const _layout = () => {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" />
        <Stack.Screen name="Onboarding" />
        <Stack.Screen name="SelectCategory" />
        <Stack.Screen
          name="Login"
          options={{ animation: "fade", animationDuration: 50 }}
        />
        <Stack.Screen
          name="Register"
          options={{ animation: "fade", animationDuration: 50 }}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ animation: "fade", animationDuration: 50 }}
        />
        <Stack.Screen name="OTPVerification" />
        <Stack.Screen name="CreateNewPassword" />
      </Stack>
    </View>
  );
};

export default _layout;
