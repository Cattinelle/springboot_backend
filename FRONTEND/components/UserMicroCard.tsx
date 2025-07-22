// FRONTEND/components/UserMicroCard.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import TransparentButton from "@/components/TransparentButton";
import { useUserStore } from "@/hooks/useUserStore";

export type UserMicroCardProps = {
id: string;
  avatar: string;
  name: string;
  country: string;
};

const UserMicroCard = ({ id, avatar, name, country }: UserMicroCardProps) => {
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
  const isFriend = friends.includes(id);
  const isSent = sentRequests.includes(id);
  const isReceived = receivedRequests.includes(id);

  // Button handlers communicate directly with zustand
  const handleAddFriend = async () => {
    await sendFriendRequest(id);
    // UI will update automatically due to zustand state change
  };
  const handleCancelPending = async () => {
    await cancelFriendRequest(id);
  };
  const handleAccept = async () => {
    await acceptFriendRequest(id);
  };
  const handleRemoveFriend = async () => {
    await removeFriend(id);
  };

  // UI logic for which button to show
  const showAddFriend = !isFriend && !isSent && !isReceived;

  return (
    <View className="w-[150px] h-[212px] flex-column gap-1 justify-center items-center bg-white rounded-xl mr-3 shadow-sm">
      {/* User Avatar */}
      <View className="flex-column items-center">
        <Image
          source={{ uri: avatar }}
          className="w-[96px] h-[96px] rounded-full mb-1.5"
          resizeMode="cover"
        />
        {/* User Name */}
        <Text className="font-bold font-Manrope text-BodyBold text-neutral-90">
          {name}
        </Text>
        {/* User Country */}
        <View className="flex-row items-center gap-0.5 ">
          <SimpleLineIcons name="location-pin" size={12} color="#757575" />
          <Text className="text-BodySmallRegular text-neutral-60 font-Manrope font-medium">
            {country}
          </Text>
        </View>
      </View>

      {/* Add Friend Button */}
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
  );
};

export default UserMicroCard;
