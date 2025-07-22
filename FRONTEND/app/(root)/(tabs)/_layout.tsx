import { Fontisto, Foundation, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, View } from "react-native";

const TabsLayout = () => (
  <View className="flex-1 bg-white">
    <StatusBar style="dark" />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E95B0C",
        tabBarInactiveTintColor: "#616161",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Manrope", // Ensure this is loaded via useFonts
          fontWeight: "600",
        },
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 0 : 10,
          backgroundColor: "#fff",
          borderRadius: 25,
          height: 100,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Foundation
              name="home"
              size={25}
              color={focused ? "#E95B0C" : "#616161"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Fontisto
              name="search"
              size={20}
              color={focused ? "#E95B0C" : "#616161"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Library"
        options={{
          title: "Library",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={23}
              color={focused ? "#E95B0C" : "#616161"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-circle-outline"
              size={25}
              color={focused ? "#E95B0C" : "#616161"}
            />
          ),
        }}
      />
    </Tabs>
  </View>
);

export default TabsLayout;
