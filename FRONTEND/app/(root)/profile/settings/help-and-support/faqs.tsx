import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const FAQS = [
  {
    question: "1. How long are the book summaries?",
    answer:
      "Each summary is designed to take around 10–15 minutes to read or listen to.",
  },
  {
    question: "2. Can I track my reading progress?",
    answer:
      "Absolutely! You can set goals, view your streak, and track completed books right from your profile.",
  },
  {
    question: "3. How are book suggestions personalized?",
    answer:
      "We recommend books based on your goals, interests, and learning habits.",
  },
];

const FAQs = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

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
          <Text className="text-orange-500 font-bold text-lg">&gt; FAQs</Text>
        </Text>

        <View className="bg-white rounded-2xl mx-4 p-2.5 shadow-lg border border-gray-100">
          {FAQS.map((faq, idx) => (
            <View key={idx}>
              <TouchableOpacity
                className="flex-row items-center py-4.5 px-1.5"
                onPress={() => handleToggle(idx)}
              >
                <Text className="text-base text-gray-800 flex-1">
                  {faq.question}
                </Text>
                <Ionicons
                  name={expanded === idx ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#bbb"
                />
              </TouchableOpacity>
              {expanded === idx && (
                <View className="px-1.5 pb-3">
                  <Text className="text-sm text-gray-700">{faq.answer}</Text>
                </View>
              )}
              {idx < FAQS.length - 1 && (
                <View className="h-px bg-gray-200 rounded-sm" />
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FAQs;
