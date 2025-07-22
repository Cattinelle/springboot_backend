import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import UserCard from "@/components/UserCard";
import { useUserStore } from "@/hooks/useUserStore";
import { Ionicons } from "@expo/vector-icons";

// Mock fetch friends for a user
const mockFetchFriends = async (id: string) => {
  // Replace with real API call
  return [
    {
      id: "friend1",
      name: "Friend 1",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      country: "USA",
    },
    {
      id: "friend2",
      name: "Friend 2",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      country: "Canada",
    },
    {
      id: "friend3",
      name: "Friend 3",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      country: "UK",
    },
    {
      id: "friend4",
      name: "Friend 4",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      country: "Australia",
    },
  ];
};



export default function UserFriends() {
  const { id, name } = useLocalSearchParams();
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const {
    friends,
    sentRequests,
    receivedRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
  } = useUserStore();

  useEffect(() => {
    if (typeof id === "string") {
      mockFetchFriends(id).then(setFriendsList);
      setUserName(typeof name === "string" ? name.split(" ")[0] : "This user");
    }
  }, [id, name]);

  const userFirstName = userName ? userName.split(" ")[0] : "This user";

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-5 bg-neutral-10 border-b border-neutral-20">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-Heading5 font-Manrope font-bold text-secondary flex-1">
          {userFirstName}'s Friends
        </Text>
      </View>
      <ScrollView className="flex-1 px-3 py-5">
        {friendsList.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-neutral-50 text-base mt-4 mb-2">
              {userFirstName} has no friends at the moment
            </Text>
          </View>
        ) : (
          friendsList.map((friend) => {
            const isFriend = friends.includes(friend.id);
            const isSent = sentRequests.includes(friend.id);
            const isReceived = receivedRequests.includes(friend.id);
            return (
              <UserCard
                key={friend.id}
                user={friend}
                isFriend={isFriend}
                isSent={isSent}
                isReceived={isReceived}
                onAddFriend={() => sendFriendRequest(friend.id)}
                onCancelPending={() => cancelFriendRequest(friend.id)}
                onAccept={() => acceptFriendRequest(friend.id)}
                onRemoveFriend={() => removeFriend(friend.id)}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
