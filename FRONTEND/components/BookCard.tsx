import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type BookCardProps = {
  title: string;
  author: string;
  cover: string;
  onPress?: () => void;
  id?: number;
};

export default function BookCard({
  title,
  author,
  cover,
  onPress,
  id,
}: BookCardProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={
        onPress
          ? onPress
          : () =>
              id &&
              router.push({
                pathname: "/summary/[id]",
                params: { id: String(id) },
              })
      }
    >
      <View className="relative">
        <Image
          source={{ uri: cover }}
          className="w-[130px] h-[200px] rounded-[10px] z-0"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/[0.03] z-10 rounded-[10px]"></View>
      </View>

      <Text
        numberOfLines={1}
        className=" mt-2 text-BodySmallRegular font-Manrope font-semibold text-neutral-100"
      >
        {author.length > 16 ? author.slice(0, 16) + "..." : author}
      </Text>
    </TouchableOpacity>
  );
}
