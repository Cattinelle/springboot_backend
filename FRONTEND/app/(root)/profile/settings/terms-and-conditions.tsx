import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TermsAndConditions = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-10 px-5 pb-2.5 bg-white">
        <View className="flex-row items-center flex-1">
          <Text className="text-xl font-bold text-gray-800">Settings</Text>
          <Text className="text-base text-gray-500 font-bold"> &gt; </Text>
          <Text className="text-base text-orange-500 font-bold">
            Terms and Condition
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
              name="file-document-outline"
              size={28}
              color="#BCA16B"
              className="mr-2"
            />
            <Text className="text-xl font-bold text-gray-800">
              Terms & Conditions
            </Text>
          </View>

          <Text className="text-xs text-gray-700 mb-0.5">
            <Text className="font-bold">Effective Date:</Text> June 7th, 2025.
          </Text>
          <Text className="text-xs text-gray-700 mb-2.5">
            <Text className="font-bold">App Name:</Text> QuickTales
          </Text>

          <Text className="text-sm text-gray-700 mb-2.5">
            Welcome to <Text className="font-bold">QuickTales</Text> By
            accessing or using our app, you agree to be bound by these Terms and
            Conditions. Please read them carefully.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Acceptance of Terms
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            By creating an account, using features, or accessing any content on
            this app, you agree to these Terms. (If you do not agree, please do
            not use the app.)
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            User Accounts
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            To access most features, you must create an account. You agree to:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Provide accurate and up-to-date information
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Keep your login credentials secure
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Be responsible for any activity under your account
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2.5">
            You may update or delete your account at any time via your profile
            settings.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Use of the App
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            You may use this app for personal, non-commercial learning purposes.
            You agree not to:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Post inappropriate, hateful, or unlawful content
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Copy, reproduce, or distribute content without permission
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Misuse any feature in ways that harm others or disrupt the
              platform
            </Text>
          </View>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Content
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            All content including summaries, quotes, and community posts are
            either:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Created by us
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Generated by users
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Sourced from public domain or with proper attribution
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2.5">
            By submitting content (suggestions, comments, etc.), you grant us a
            non-exclusive, royalty-free license to use, display, and moderate
            that content within the app.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Community Features
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            The app may allow you to:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Share book suggestions
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Participate in discussions
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Interact with other users' content
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2.5">
            We reserve the right to remove content or suspend users who violate
            community guidelines.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Intellectual Property
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            All designs, branding, and original content are owned by QuickTales
            and protected under copyright laws. You may not use our brand assets
            without written permission.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Modifications to the App
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We may update or change features at any time to improve your
            experience. We are not liable for any temporary downtime or feature
            changes.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Termination
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We may suspend or terminate your access if you violate these terms
            or abuse the platform. You may delete your account anytime if you
            choose to stop using the app.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Limitation of Liability
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We strive for accuracy but do not guarantee that all summaries or
            content are free of error. We are not responsible for:
          </Text>
          <View className="ml-2.5 mb-2">
            <Text className="text-xs text-gray-700 mb-0.5">
              • Any decisions made based on app content
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • Technical issues or data loss
            </Text>
            <Text className="text-xs text-gray-700 mb-0.5">
              • User-submitted content
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-2.5">
            Use the app at your own discretion.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Changes to Terms
          </Text>
          <Text className="text-sm text-gray-700 mb-2.5">
            We may update these Terms from time to time. You will be notified of
            significant changes via email or in-app notification.
          </Text>

          <View className="h-px bg-gray-200 my-2.5 rounded-sm" />

          <Text className="text-sm font-bold text-gray-800 mt-2.5 mb-1">
            Contact Us
          </Text>
          <Text className="text-sm text-gray-700 mb-1">
            If you have questions, concerns, reach out to us:
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

export default TermsAndConditions;
