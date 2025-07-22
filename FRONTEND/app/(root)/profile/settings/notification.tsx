import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NotificationSettings = () => {
  const router = useRouter();
  const [dailyReminder, setDailyReminder] = useState(false);
  const [streakUpdates, setStreakUpdates] = useState(false);
  const [newBookReleases, setNewBookReleases] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-10 px-5 pb-2.5 bg-white">
        <View className="flex-row items-center flex-1">
          <Text className="text-xl font-bold text-red-700">Settings</Text>
          <Text className="text-base text-gray-500 font-bold"> &gt; </Text>
          <Text className="text-base text-orange-500 font-bold">
            Notification
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Notification Options */}
      <View className="bg-white rounded-2xl mx-4 p-2.5 shadow-sm border border-gray-100">
        <View className="flex-row items-center py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-800 mb-0.5">
              Daily Reminder
            </Text>
            <Text className="text-xs text-gray-500">
              Get a gentle daily nudge to stay on track with your reading habit.
            </Text>
          </View>
          <Switch
            value={dailyReminder}
            onValueChange={setDailyReminder}
            trackColor={{ false: "#ccc", true: "#F96C00" }}
            thumbColor={dailyReminder ? "#fff" : "#fff"}
          />
        </View>

        <View className="flex-row items-center py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-800 mb-0.5">
              Streak Updates
            </Text>
            <Text className="text-xs text-gray-500">
              Receive updates about your reading streak to help build
              consistency.
            </Text>
          </View>
          <Switch
            value={streakUpdates}
            onValueChange={setStreakUpdates}
            trackColor={{ false: "#ccc", true: "#F96C00" }}
            thumbColor={streakUpdates ? "#fff" : "#fff"}
          />
        </View>

        <View className="flex-row items-center py-4">
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-800 mb-0.5">
              New Book Releases
            </Text>
            <Text className="text-xs text-gray-500">
              Get notified when new summaries or books are added to the library.
            </Text>
          </View>
          <Switch
            value={newBookReleases}
            onValueChange={setNewBookReleases}
            trackColor={{ false: "#ccc", true: "#F96C00" }}
            thumbColor={newBookReleases ? "#fff" : "#fff"}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationSettings;
