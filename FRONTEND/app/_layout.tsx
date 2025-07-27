import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import Toast from "@/components/Toast";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope: require("@/assets/fonts/Manrope-VariableFont_wght.ttf"),
    Montserrat: require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "fade", animationDuration: 300 }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(root)" />
          <Stack.Screen name="findfriends"   />
          <Stack.Screen name="category" />
          
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </View>
    </SafeAreaProvider>
  );
}
