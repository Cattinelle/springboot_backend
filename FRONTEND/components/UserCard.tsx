import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TransparentButton from "@/components/TransparentButton";
import { useUserStore } from "@/hooks/useUserStore";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    country: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter();
  // Get friend state and actions from zustand store
  const {
    friends,
    sentRequests,
    receivedRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
  } = useUserStore();

  // Compute friend status
  const isFriend = friends.includes(user.id);
  const isSent = sentRequests.includes(user.id);
  const isReceived = receivedRequests.includes(user.id);

  // Button handlers communicate directly with zustand
  const handleAddFriend = async () => {
    await sendFriendRequest(user.id);
  };
  const handleCancelPending = async () => {
    await cancelFriendRequest(user.id);
  };
  const handleAccept = async () => {
    await acceptFriendRequest(user.id);
  };
  const handleRemoveFriend = async () => {
    await removeFriend(user.id);
  };

  // UI logic for which button to show
  const showAddFriend = !isFriend && !isSent && !isReceived;

  return (
    <TouchableOpacity
      className="active:bg-neutral-20 flex-row gap-5 items-center bg-neutral-10 rounded-xl mb-3 px-[18px] py-[12px] shadow-black-shadow border border-neutral-20"
      activeOpacity={0.6}
      onPress={() => router.push(`/user/${user.id}`)}
    >
      <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full" />
      <View className="flex-1 justify-start items-start gap-0.5">
        <Text className="font-bold font-Manrope text-BodyBold text-neutral-90">
          {user.name.length > 14 ? user.name.slice(0, 14) + "..." : user.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={16} color="#757575" />
          <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular">
            {user.country}
          </Text>
        </View>
        <View className="mt-2 relative">
          {showAddFriend ? (
            <TransparentButton
              text="Add Friend"
              textClassName="text-primary font-Manrope font-medium text-[13px]"
              nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
              onPress={handleAddFriend}
              icon={
                <Ionicons name="person-add-outline" size={16} color="#E95B0C" />
              }
            />
          ) : isFriend ? (
            <View className="flex-row items-center">
              <FontAwesome5
                name="user-friends"
                size={16}
                color="#E95B0C"
                className="mr-1"
              />
              <Text className="text-primary font-Manrope font-semibold text-[14px] ml-1">
                Friends
              </Text>
            </View>
          ) : isSent ? (
            <TransparentButton
              text="Pending"
              textClassName="text-primary font-Manrope font-medium text-[13px]"
              nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
              onPress={handleCancelPending}
              icon={<Ionicons name="time-outline" size={18} color="#E95B0C" />}
            />
          ) : isReceived ? (
            <TransparentButton
              text="Accept"
              textClassName="text-green-700 font-Manrope font-medium text-[13px]"
              nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
              onPress={handleAccept}
              icon={
                <MaterialCommunityIcons
                  name="account-check-outline"
                  size={16}
                  color="#E95B0C"
                />
              }
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
