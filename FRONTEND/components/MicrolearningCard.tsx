import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

type Props = {
  image: string;
  insights: string[];
  onPress: () => void;
  completed: boolean;
};

const MicrolearningCard = ({ image, onPress, completed }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`rounded-xl overflow-hidden border-2 ${
        completed ? "border-neutral-50" : "border-primary"
      }`}
    >
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="w-[60px] h-[85px] rounded-xl object-cover"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/[0.03] z-10 rounded-[10px]"></View>
      </View>
    </TouchableOpacity>
  );
};

export default MicrolearningCard;
