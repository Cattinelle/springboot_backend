import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-10 px-5 pb-2.5 bg-white">
        <Text className="text-2xl font-bold text-red-700">Settings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ScrollView
          className="px-5 pt-2.5"
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Options */}
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl py-2.5 px-2.5 mb-1.5 border border-gray-100 shadow-sm"
            onPress={() => router.push("/profile/settings/notification")}
          >
            <Feather name="bell" size={20} color="#F96C00" className="mr-4" />
            <Text className="flex-1 text-base text-gray-800">
              Notifications
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#bbb"
              className="ml-2"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl py-2.5 px-2.5 mb-1.5 border border-gray-100 shadow-sm"
            onPress={() => router.push("/profile/settings/privacy-policy")}
          >
            <Feather name="shield" size={20} color="#F96C00" className="mr-4" />
            <Text className="flex-1 text-base text-gray-800">
              Privacy Policy
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#bbb"
              className="ml-2"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl py-2.5 px-2.5 mb-1.5 border border-gray-100 shadow-sm"
            onPress={() =>
              router.push("/profile/settings/terms-and-conditions")
            }
          >
            <Feather
              name="file-text"
              size={20}
              color="#F96C00"
              className="mr-4"
            />
            <Text className="flex-1 text-base text-gray-800">
              Terms & Conditions
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#bbb"
              className="ml-2"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl py-2.5 px-2.5 mb-1.5 border border-gray-100 shadow-sm"
            onPress={() => router.push("/profile/settings/help-and-support")}
          >
            <Feather
              name="help-circle"
              size={20}
              color="#F96C00"
              className="mr-4"
            />
            <Text className="flex-1 text-base text-gray-800">
              Help & Support
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color="#bbb"
              className="ml-2"
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Log out Button */}
        <TouchableOpacity className="self-center mt-2 mb-2.5 bg-white border border-orange-500 rounded-lg px-7.5 py-2">
          <Text className="text-orange-500 font-bold text-sm">Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
