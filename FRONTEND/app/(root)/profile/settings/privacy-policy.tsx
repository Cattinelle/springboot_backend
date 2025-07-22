import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-10 px-5 pb-2.5 bg-white">
        <View className="flex-row items-center flex-1">
          <Text className="text-xl font-bold text-gray-800">Settings</Text>
          <Text className="text-base text-gray-500 font-bold"> &gt; </Text>
          <Text className="text-base text-orange-500 font-bold">
            Privacy Policy
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl mx-4 p-4.5 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-2.5">
            <MaterialCommunityIcons
              name="scroll"
              size={28}
              color="#BCA16B"
              className="mr-2"
            />
            <Text className="text-xl font-bold text-gray-800">
              Privacy Policy
            </Text>
          </View>

          <Text className="text-xs text-gray-700 mb-0.5">
            <Text className="font-bold">Effective Date:</Text> June 7th, 2025.
          </Text>
          <Text className="text-xs text-gray-700 mb-2.5">
            <Text className="font-bold">App Name:</Text> QuickTales
          </Text>

          <Text className="text-sm text-gray-700 mb-2.5">
            We value your privacy and are committed to protecting your personal
            information. This Privacy Policy outlines how we collect, use, and
            protect your data when you use our app.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Information We Collect
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            When you use our app, we may collect the following information:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Basic Info: Name, email address, profile picture
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Reading Activity: Bookmarked books, summaries read, flashcard
              usage, streak progress, and completed goals
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Preferences: Learning goals, content preferences, religious
              preferences (optional)
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • User Content: Suggestions, reviews, discussion comments,
              highlights
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Device Data: App usage patterns, crash reports, device type
              (non-personal)
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            How We Use Your Information
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We use your data to enhance your experience, including:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Personalizing your home feed and book recommendations
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Delivering daily summaries and motivational content
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Displaying faith-based content only if you opt in
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Tracking your learning goals, streaks, and progress
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Enabling interactive community features like suggestions and
              discussions
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Sending relevant notifications about your learning activity
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Data Sharing & Disclosure
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We do not sell or rent your personal information. We may share
            anonymized, aggregated data with trusted partners to improve app
            performance and insights. In limited cases, we may share personal
            data:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • With your consent
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • To comply with legal obligations
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • With third-party services necessary to run core features (e.g.,
              cloud hosting or analytics)
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Your Privacy Controls
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            You have control over how your data is used:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Update your learning goals and personal info
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Delete your account and data at any time
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Data Retention
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We retain your data for as long as your account is active, or as
            needed to provide services, resolve disputes, or meet legal
            obligations.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Data Security
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We implement reasonable security measures such as:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Encrypted storage
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Secure authentication
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Regular monitoring for unauthorized access
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2.5">
            However, no system is 100% secure. Please take precautions when
            sharing personal information.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Children's Privacy
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            This app is not intended for children under the age of 13. We do not
            knowingly collect data from children without parental consent.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Changes to This Policy
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We may update this Privacy Policy to reflect changes in our
            practices. Major changes will be communicated through the app or via
            email. Please review this policy regularly.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Contact Us
          </Text>
          <Text className="text-sm text-gray-700 mb-1">
            If you have questions, concerns, or requests regarding this Privacy
            Policy, contact us at:
          </Text>
          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color="#F96C00"
              className="mr-1.5"
            />
            <Text className="text-orange-500 text-sm">
              quicktales@outlook.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
