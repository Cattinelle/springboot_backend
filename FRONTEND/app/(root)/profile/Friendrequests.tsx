import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import FriendRequestsCard from "@/components/FriendRequestsCard";
import { useUserStore } from "@/hooks/useUserStore";

// Mock user data for requests
const mockReceived = [
  {
    id: "user1",
    name: "Mary Smith",
    country: "United States",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "user2",
    name: "Joshua Nyannor",
    country: "Ghana",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "user3",
    name: "Angela James",
    country: "New Zealand",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "user4",
    name: "Michael Flynn",
    country: "Jamaica",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];
const mockSent = [
  {
    id: "user5",
    name: "Vera Cruz",
    country: "Brazil",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "user6",
    name: "John Doe",
    country: "USA",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

const Friendrequests = () => {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const {
    friends,
    sentRequests,
    receivedRequests,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    sendFriendRequest,
    removeFriend,
  } = useUserStore();

  // For demo, use mock data for users
  const received = mockReceived;
  const sent = mockSent;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-neutral-10 flex-column border-b border-neutral-30">
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={10}
            activeOpacity={0.6}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text className=" flex-1 text-Heading4 text-center font-Manrope font-bold text-secondary">
            Friend Requests
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-row w-full">
          <TouchableOpacity
            onPress={() => setTab("received")}
            className="flex-1 w-1/2"
            activeOpacity={0.6}
          >
            <Text
              className={`items-center py-3 text-center font-bold font-Manrope text-BodyRegular ${tab === "received" ? "text-neutral-100 border-b-2  border-neutral-100" : "text-neutral-50"}`}
            >
              Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("sent")}
            className="flex-1 w-1/2"
            activeOpacity={0.6}
          >
            <Text
              className={` items-center py-3 text-center font-bold font-Manrope text-BodyRegular ${tab === "sent" ? "text-neutral-100 border-b-2  border-neutral-100" : "text-neutral-50"}`}
            >
              Sent
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Content */}
      <ScrollView
        className="flex-1 bg-white px-3 py-5"
        showsVerticalScrollIndicator={false}
      >
        {tab === "received" && received.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20">
            <Ionicons name="person-add-outline" size={64} color="#ccc" />
            <Text className="text-Heading5 font-Manrope font-bold text-neutral-70 mt-4 mb-2">
              No friend requests received
            </Text>
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-60 text-center">
              Add a friend to see it here.
            </Text>
          </View>
        )}
        {tab === "received" &&
          received.length > 0 &&
          received.map((user) => (
            <FriendRequestsCard
              key={user.id}
              user={user}
              rightActions={
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    activeOpacity={0.6}
                    className="mr-2"
                    onPress={() => acceptFriendRequest(user.id)}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={34}
                      color="#4CAF50"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => declineFriendRequest(user.id)}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={34}
                      color="#F44336"
                    />
                  </TouchableOpacity>
                </View>
              }
            />
          ))}
        {tab === "sent" && sent.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20">
            <Ionicons name="person-add-outline" size={64} color="#ccc" />
            <Text className="text-Heading5 font-Manrope font-bold text-neutral-70 mt-4 mb-2">
              No Pending Friend Requests
            </Text>
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-60 text-center">
              Your pending friend requests will show up here.
            </Text>
          </View>
        )}
        {tab === "sent" &&
          sent.length > 0 &&
          sent.map((user) => (
            <FriendRequestsCard
              key={user.id}
              user={user}
              rightActions={
                <TouchableOpacity
                  activeOpacity={0.6}
                  className="bg-gray-100 rounded-[8px] px-[18px] py-[10px]"
                  onPress={() => cancelFriendRequest(user.id)}
                >
                  <Text className="text-neutral-90 font-Manrope font-semibold">
                    Withdraw
                  </Text>
                </TouchableOpacity>
              }
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Friendrequests;
