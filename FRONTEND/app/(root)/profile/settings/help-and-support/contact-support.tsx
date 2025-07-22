import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ContactSupport = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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
            &gt; Contact Support
          </Text>
        </Text>

        <View className="bg-white rounded-2xl mx-4 p-4 shadow-lg border border-gray-100">
          <Text className="text-base font-bold text-gray-800 mb-1">
            Need help? We're here for you.
          </Text>
          <Text className="text-sm text-gray-500 mb-2">
            If you're experiencing issues, have questions, or need assistance
            with QuickTales, feel free to reach out.
          </Text>

          <Text className="text-sm font-bold text-gray-800 mt-2 mb-0.5">
            Contact Us
          </Text>
          <Text className="text-sm text-gray-800 mb-0.5">
            Email:{" "}
            <Text className="text-orange-500">quicktales@outlook.com</Text>
          </Text>
          <Text className="text-sm text-gray-800 mb-2">
            Phone: <Text className="text-orange-500">+233 590340980</Text>
          </Text>

          <Text className="text-sm text-gray-500 mb-2.5">
            Feel free to drop any complaint or questions in the message form
            below.
          </Text>

          <TextInput
            className="bg-gray-100 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 mt-2.5 mb-0"
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#888"
          />

          <TextInput
            className="bg-gray-100 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 mt-2.5 mb-0 h-20"
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#888"
          />

          <TouchableOpacity className="bg-orange-500 rounded-lg mt-4.5 items-center py-3.5 mb-6">
            <Text className="text-white font-bold text-base tracking-wider">
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ContactSupport;
