import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SuggestFeature = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
          <Text className="text-gray-800 font-bold text-lg">
            &gt; Help and Support
          </Text>{" "}
          <Text className="text-orange-500 font-bold text-lg">
            &gt; Suggest a Feature
          </Text>
        </Text>

        <View className="bg-white rounded-2xl mx-4 p-4 pb-8 shadow-lg border border-gray-100">
          <Text className="text-base font-bold text-gray-800 mb-1">
            Have an idea? We'd love your input.
          </Text>
          <Text className="text-sm text-gray-500 mb-2">
            If you have an idea, feature request, or improvement suggestion for
            QuickTales, we're all ears. Help us make the app better for
            everyone.
          </Text>

          <Text className="text-sm font-bold text-gray-800 mt-2 mb-0.5">
            Share Your Idea
          </Text>
          <Text className="text-sm text-gray-800 mb-0.5">
            Email:{" "}
            <Text className="text-orange-500">quicktales@outlook.com</Text>
          </Text>
          <Text className="text-sm text-gray-800 mb-2">
            Phone: <Text className="text-orange-500">+233 590340980</Text>
          </Text>

          <Text className="text-sm text-gray-500 mb-2.5">
            We appreciate your feedback. Kindly fill out the form below with any
            feature suggestion you'd like to see in QuickTales.
          </Text>

          <TextInput
            className="bg-gray-100 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 mt-2.5 mb-0"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />

          <TextInput
            className="bg-gray-100 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 mt-2.5 mb-0 h-20"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#888"
          />

          <TouchableOpacity className="bg-orange-500 rounded-lg mt-4.5 items-center py-3.5 w-full self-center">
            <Text className="text-white font-bold text-base tracking-wider">
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SuggestFeature;
