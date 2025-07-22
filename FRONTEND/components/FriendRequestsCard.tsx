import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface FriendRequestsCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    country: string;
  };
  rightActions?: React.ReactNode;
}

// Card for friend requests: shows avatar, name, location, and custom rightActions (accept/decline/withdraw)
const FriendRequestsCard: React.FC<FriendRequestsCardProps> = ({
  user,
  rightActions,
}) => {
  const router = useRouter();
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
      </View>
      {/* Right side actions for friend requests (accept/decline/withdraw) */}
      {rightActions}
    </TouchableOpacity>
  );
};

export default FriendRequestsCard;
