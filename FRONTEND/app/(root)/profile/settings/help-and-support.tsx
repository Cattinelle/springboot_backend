import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HelpAndSupport = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-10 px-5 pb-2.5 bg-white">
        <Text className="text-3xl font-bold text-red-700">Settings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-start">
        <Text className="text-lg font-bold text-gray-800 mt-2.5 ml-4 mb-2.5">
          Settings{" "}
          <Text className="text-orange-500 font-bold text-lg">
            &gt; Help and Support
          </Text>
        </Text>

        <View className="bg-white rounded-2xl mx-4 p-2.5 shadow-lg border border-gray-100">
          <TouchableOpacity
            className="flex-row items-center py-4.5 px-1.5"
            onPress={() =>
              router.push("/profile/settings/help-and-support/faqs")
            }
          >
            <Text className="text-2xl mr-3.5">📘</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-800 mb-0.5">
                FAQs
              </Text>
              <Text className="text-sm text-gray-500">
                Got questions? Find quick answers to common issues.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#bbb" />
          </TouchableOpacity>

          <View className="h-px bg-gray-200 rounded-sm" />

          <TouchableOpacity
            className="flex-row items-center py-4.5 px-1.5"
            onPress={() =>
              router.push("/profile/settings/help-and-support/contact-support")
            }
          >
            <Text className="text-2xl mr-3.5">📩</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-800 mb-0.5">
                Contact Support
              </Text>
              <Text className="text-sm text-gray-500">
                Need help? Reach out to our support team anytime.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#bbb" />
          </TouchableOpacity>

          <View className="h-px bg-gray-200 rounded-sm" />

          <TouchableOpacity
            className="flex-row items-center py-4.5 px-1.5"
            onPress={() =>
              router.push("/profile/settings/help-and-support/suggest-feature")
            }
          >
            <Text className="text-2xl mr-3.5">💡</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-800 mb-0.5">
                Suggest a Feature
              </Text>
              <Text className="text-sm text-gray-500">
                Have an idea to improve the app? Share it with us!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#bbb" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HelpAndSupport;
